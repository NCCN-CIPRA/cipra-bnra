import { v4 as uuid } from "uuid";

const responses: { [key: string]: Response } = {};

export default function patchFetch() {
  // @ts-expect-error oldFetch doesn't exist
  window.oldFetch = window.fetch;
  window.fetch = devFetch;

  window.onmessage = function (e) {
    if (e.data && e.data.requestData) {
      responses[e.data.requestData.id] = new Response(
        e.data.body || undefined,
        {
          status: e.data.status,
          headers: new Headers(e.data.headers),
        }
      );
    } else if (e.data && e.data.userInfo) {
      const div = document.createElement("div");
      div.innerHTML = e.data.userInfo;

      if (e.data.userInfo.indexOf('data-id=""') > 0) {
        // Not logged in in Iframe
        // document.getElementById("loginWindow")!.style.display = "block";
        // document.getElementById("loginWindow")!.setAttribute("src", "https://bnra.powerappsportals.com/auth");
        // window.alert("Please log in and refresh the page");
      } else {
        document.body.appendChild(div);
      }
    }
  };
}

async function devFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  // @ts-expect-error is does exist
  if (input.match(/powerappsportal/)) {
    return new Promise<Response>((resolve) => {
      const requestId = uuid();

      setTimeout(
        () => {
          // @ts-expect-error it does exist
          window.frames.localApi.postMessage(
            JSON.stringify({
              url: input,
              requestData: { id: requestId },
              options: init,
            }),
            "*"
          );
        },
        // @ts-expect-error why
        window.fetch.loaded ? 0 : 5000
      );

      const interval = setInterval(async () => {
        if (responses[requestId]) {
          clearInterval(interval);
          const response = responses[requestId];

          delete responses[requestId];

          // if (response.status === 403) {
          //   const errorJson = await response.json();

          //   if (errorJson.error && errorJson.error.code === "90040120") {
          //     // Not logged in in Iframe
          //     document.getElementById("loginWindow")!.style.display = "block";
          //     document.getElementById("loginWindow")!.setAttribute("src", "https://bnra.powerappsportals.com/auth");

          //     const testingInterval = setInterval(async () => {
          //       const testResponse = await devFetch(input, init);

          //       if (testResponse.status !== 403) {
          //         clearInterval(testingInterval);
          //         document.getElementById("loginWindow")!.style.display = "none";
          //         document.getElementById("loginWindow")!.setAttribute("src", "");

          //         return resolve(testResponse);
          //       }
          //     }, 5000);
          //   }
          // } else {
          return resolve(response);
          // }
        }
      }, 500);
    });
  } else {
    // @ts-expect-error just defined it
    return window.oldFetch(input, init);
  }
}
