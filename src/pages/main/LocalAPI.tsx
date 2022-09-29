import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    const listener = async function (e: any) {
      console.log(e.data);
      console.log(e.source);

      try {
        const data = JSON.parse(e.data);

        const response = await fetch(data.url, data.options);
        // eslint-disable-next-line no-restricted-globals
        console.log(parent);
        // eslint-disable-next-line no-restricted-globals
        parent?.postMessage(await response.text(), "*");
      } catch (e) {
        // empty by design
      }
    };

    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return <>LOCAL API</>;
}
