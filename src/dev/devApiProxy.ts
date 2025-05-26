import fetch from "node-fetch";
import { getAntiForgeryToken } from "../functions/api";
import { ViteDevServer } from "vite";

export default async function configureServer() {
  const { cookie } = await import("./cookie");

  const antiForgeryToken = await getAntiForgeryToken({
    cookie: cookie,
  });

  return (server: ViteDevServer) => {
    server.middlewares.use("/_api", async (req, res) => {
      try {
        const bodyChunks: Uint8Array[] = [];
        req.on("data", (chunk: Uint8Array) => bodyChunks.push(chunk));
        req.on("end", async () => {
          const rawBody = Buffer.concat(bodyChunks).toString();

          const proxyRes = await fetch(
            `https://bnra.powerappsportals.com/_api${req.url}`,
            {
              method: req.method,
              headers: {
                // ...(req.headers || {}),
                cookie: cookie,
                __RequestVerificationToken: antiForgeryToken,
              },
              body: ["GET", "HEAD"].includes(req.method || "")
                ? undefined
                : rawBody,
            }
          );

          const data = await proxyRes.text();
          if (req.method === "POST" || req.method === "PATCH")
            console.log(data);
          res.statusCode = proxyRes.status;
          res.setHeader(
            "Content-Type",
            proxyRes.headers.get("content-type") || "text/plain"
          );
          res.end(data);
        });
      } catch (err) {
        console.error("Proxy error:", err);
        res.statusCode = 500;
        res.end("Proxy error");
      }
    });
  };
}
