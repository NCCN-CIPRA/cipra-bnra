import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { comlink } from "vite-plugin-comlink";
import configureServer from "./src/dev/devApiProxy";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    comlink(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    nodePolyfills(),
    {
      name: "dev-api-proxy",
      configureServer: configureServer,
    },
  ],
  worker: {
    plugins: () => [
      comlink(),
      svgr({
        svgrOptions: {
          // svgr options
        },
      }),
    ],
  },
  base:
    command === "build" ? "https://nccn-cipra.github.io/cipra-bnra" : undefined,
  build: {
    // minify: false,
    rollupOptions: {
      external: ["**/_deprecated/**"],
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  test: {
    globals: true,
    setupFiles: "./src/test/setup.ts",
    environment: "jsdom",
    server: {
      deps: {
        inline: ["@mui/x-data-grid"],
      },
    },
  },
}));
