import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App.tsx";
import theme from "./theme.tsx";
import { ThemeProvider } from "@mui/material";

import "./i18n";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import patchFetch from "./functions/devFetch";

// Override fetch in dev environment
if (window.location.href.match(/localhost.*/)) {
  patchFetch();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {
      // These iframes are used for development purposes only
      window.location.href.indexOf("localhost") >= 0 && (
        <>
          <iframe
            id="localApi"
            title="localApi"
            name="localApi"
            src="https://bnra.powerappsportals.com/__dev/localapi"
            style={{ display: "none" }}
            onLoad={() => {
              // @ts-expect-error window
              window.fetch.loaded = true;

              // @ts-expect-error window
              window.frames.localApi.postMessage("getUserInfo", "*");
            }}
          />
          <iframe
            id="loginWindow"
            title="loginWindow"
            style={{
              display: "none",
              position: "absolute",
              width: "100vw",
              height: "100vh",
              top: 0,
              zIndex: 10000,
              backgroundColor: "white",
            }}
          />
        </>
      )
    }
  </StrictMode>
);
