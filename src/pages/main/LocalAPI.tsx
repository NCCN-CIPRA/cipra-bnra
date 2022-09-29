import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    const listener = async function (e: any) {
      try {
        console.log(e.data);
        const data = JSON.parse(e.data);

        const response = await fetch(data.url, data.options);

        // eslint-disable-next-line no-restricted-globals
        parent?.postMessage(
          {
            status: response.status,
            headers: response.headers,
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
