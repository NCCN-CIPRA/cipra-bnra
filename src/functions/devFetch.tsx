import { v4 as uuid } from "uuid";

const responses: { [key: string]: Response } = {};

export default function patchFetch() {
  // @ts-expect-error
  window.oldFetch = window.fetch;
  window.fetch = devFetch;

  window.onmessage = function (e) {
    if (e.data && e.data.requestData) {
      responses[e.data.requestData.id] = new Response(e.data.body || undefined, {
        status: e.data.status,
        headers: new Headers(e.data.headers),
      });
    }
  };
}

async function devFetch(input: RequestInfo | URL, init?: RequestInit | undefined) {
  // @ts-expect-error
  if (input.match(/powerappsportal/)) {
    return new Promise<Response>((resolve, reject) => {
      const requestId = uuid();

      setTimeout(
        () => {
          // @ts-expect-error
          window.frames.localApi.postMessage(
            JSON.stringify({
              url: input,
              requestData: { id: requestId },
              options: init,
            }),
            "*"
          );
        },
        // @ts-expect-error
        window.fetch.loaded ? 0 : 5000
      );

      const interval = setInterval(async () => {
        if (responses[requestId]) {
          clearInterval(interval);
          const response = responses[requestId];

          delete responses[requestId];

          if (response.status === 403) {
            const errorJson = await response.json();

            if (errorJson.error && errorJson.error.code === "90040120") {
              // Not logged in in Iframe
              document.getElementById("loginWindow")!.style.display = "block";

              const testingInterval = setInterval(async () => {
                const testResponse = await devFetch(input, init);

                if (testResponse.status !== 403) {
                  clearInterval(testingInterval);
                  document.getElementById("loginWindow")!.style.display = "none";

                  return resolve(testResponse);
                }
              }, 5000);
            }
          } else {
            return resolve(response);
          }
        }
      }, 500);
    });
  } else {
    // @ts-expect-error
    return window.oldFetch(input, init);
  }
}
