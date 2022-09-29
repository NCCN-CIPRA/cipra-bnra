import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    const listener = async function (e: any) {
      const response = await fetch(e.data.url, e.data.options);

      console.log(e.data);
      console.log(e.source);

      e.source?.postMessage(await response.text());
    };

    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return <>LOCAL API</>;
}
