import { v4 as uuid } from "uuid";

const responses = {};

export default function patchFetch() {
  window.fetch = devFetch;

  window.onmessage = function (e) {
    console.log(e);
  };
}

async function devFetch(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  const requestId = uuid();

  console.log("Setting");
  setTimeout(
    () => {
      console.log("Calling");
      // @ts-expect-error
      console.log(window.frames.localApi);
      // @ts-expect-error
      window.frames.localApi.postMessage(
        JSON.stringify({
          url: "https://bnra.powerappsportals.com/_api/cr4de_riskfileses",
          requestData: { id: requestId },
          options: {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQ0OTUwNywibmJmIjoxNjY0NDQ5NTA3LCJleHAiOjE2NjQ0NTA0MDcsImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.STnYdo-79k4BTZb8wqX83-kgKR86OWAc6JilMLAq0gnNc6Z4Z9Or2X1d824VyC2wJPsUqJzwzwCcJitRAPnild_lyP3K6bClPSpBfJ66kSxO7yGaKk58IIEIIYb4ih2gHvYy5eQATOLpBJIyXc6qGpQbBiFm8aWDwSjUkbIZfDiLlyXAcB_bIAEr4xUZt_FbsuHxXy4-33XJG842PZOyjoQAegFqk0FoToEbjFXjOyfgxo51Y7dlsuFIMNuhOVZ-pWR2116tT6GBh5zF61w5n0laQpptNE5f1WKSsT5dU59NGML9izmXB0-1CHKFcX_JhGF9Iy7GUOpHVc76_T3slg",
              __RequestVerificationToken:
                localStorage.getItem("antiforgerytoken") || "",
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        }),
        // "HALLO",
        "*"
      );
    },
    // @ts-expect-error
    window.fetch.loaded ? 0 : 1000
  );

  return new Response();
}
