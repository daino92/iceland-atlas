import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/iceland-atlas/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "Iceland Atlas",
        short_name: "Iceland Atlas",
        description: "Interactive Iceland trip planner",
        theme_color: "#081018",
        background_color: "#081018",
        display: "standalone",
        start_url: "/",
        icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api/roads/query": {
        target: "https://vegasja.vegagerdin.is",
        changeOrigin: true,
        rewrite: (url) =>
          url.replace(
            /^\/api\/roads\/query/,
            "/arcgis/rest/services/data/faerd/FeatureServer/16/query",
          ),
      },
      "/api/aurora/kp": {
        target: "https://services.swpc.noaa.gov",
        changeOrigin: true,
        rewrite: () => "/products/noaa-planetary-k-index-forecast.json",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
