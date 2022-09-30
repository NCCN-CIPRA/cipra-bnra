import { v4 as uuid } from "uuid";

const responses: { [key: string]: Response } = {};

export default function patchFetch() {
  // @ts-expect-error
  window.oldFetch = window.fetch;
  window.fetch = devFetch;

  window.onmessage = function (e) {
    if (e.data && e.data.requestData) {
      responses[e.data.requestData.id] = new Response(
        e.data.body || undefined,
        {
          status: e.data.status,
        }
      );
    }
  };
}

async function devFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
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
        window.fetch.loaded ? 0 : 1000
      );

      const interval = setInterval(() => {
        if (responses[requestId]) {
          clearInterval(interval);
          const response = responses[requestId];

          delete responses[requestId];

          return resolve(response);
        }
      }, 500);
    });
  } else {
    // @ts-expect-error
    return window.oldFetch(input, init);
  }
}
