import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

import "./i18n";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "devextreme/dist/css/dx.light.css";
import patchFetch from "./functions/devFetch";

// Override fetch in dev environment
if (window.location.href.match(/localhost:3000/)) {
  patchFetch();
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    {!window.location.href.match(/__dev\/localapi/i) && (
      <>
        <iframe
          id="localApi"
          title="localApi"
          name="localApi"
          src="https://bnra.powerappsportals.com/#/__dev/localapi"
          style={{ display: "none" }}
          onLoad={() => {
            // @ts-expect-error
            window.fetch.loaded = true;

            // @ts-expect-error
            window.frames.localApi.postMessage("getUserInfo", "*");
          }}
        />
        <iframe
          id="loginWindow"
          title="loginWindow"
          src="https://bnra.powerappsportals.com/#/auth"
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
    )}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
