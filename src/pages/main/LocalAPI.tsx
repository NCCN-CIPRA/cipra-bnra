import { useEffect } from "react";

export default function LocalAPI() {
  useEffect(() => {
    window.onmessage = async function (e) {
      const response = await fetch(e.data.url, e.data.options);

      window.top?.postMessage(await response.text(), "*");
    };
  }, []);

  return <>LOCAL API</>;
}
