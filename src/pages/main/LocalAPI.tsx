import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    const listener = async function (e: MessageEvent) {
      try {
        if (e.data === "getUserInfo") {
          parent?.postMessage(
            {
              userInfo: document.getElementById("user-information")?.outerHTML,
            },
            "*"
          );

          return;
        }
        // console.log needed to buffer data???
        // console.log(e.data);
        const data = JSON.parse(e.data);

        const response = await fetch(data.url, data.options);

        parent?.postMessage(
          {
            status: response.status,
            headers: Array.from(response.headers.entries()),
            body: await response.text(),
            requestData: data.requestData,
          },
          "*"
        );
      } catch (e) {
        // empty by design
        console.log(e);
      }
    };

    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return null;
}
