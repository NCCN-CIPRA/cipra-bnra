import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    const listener = async function (e: any) {
      try {
        // console.log needed to buffer data???
        // console.log(e.data);
        const data = JSON.parse(e.data);

        const response = await fetch(data.url, data.options);

        // eslint-disable-next-line no-restricted-globals
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
