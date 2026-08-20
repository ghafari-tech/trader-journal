import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    host: true,

    proxy: {
      "/backend": {
        target: "https://trade.piqagram.ir",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/backend/, ""),
      },
    },
  },

  preview: {
    port: 3000,
    host: true,
  },

  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    tailwindcss(),

    tanstackStart({
      srcDirectory: "src",
      server: {
        entry: "server",
      },
    }),

    viteReact(),

    nitro({
      preset: "node-server",
      routeRules: {
        "/backend/**": {
          proxy: "https://trade.piqagram.ir/**",
        },
      },
    }),
  ],
});