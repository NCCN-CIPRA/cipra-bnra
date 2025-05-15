import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { comlink } from "vite-plugin-comlink";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    comlink(),
    svgr({
      svgrOptions: {
        // svgr options
      },
    }),
    nodePolyfills(),
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
  base: "https://raw.githack.com/NCCN-CIPRA/cipra-bnra/main/dist",
  build: {
    // minify: false,
    rollupOptions: {
      external: ["**/_deprecated/**"],
    },
  },
});
