/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { TRIP } from "./src/data/trip";

const ONE_DAY = 24 * 60 * 60;

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // La web se instala como app y funciona sin conexión; se actualiza sola al publicar una versión nueva.
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: TRIP.title,
        short_name: TRIP.title,
        description: "Guía de viaje a Japón día a día.",
        lang: TRIP.lang,
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#fff6f8",
        theme_color: "#ef4f7d",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Teselas del mapa: las ya vistas se guardan para poder ver el mapa sin conexión.
            urlPattern: ({ url }) => url.hostname === "tile.openstreetmap.org",
            handler: "CacheFirst",
            options: {
              cacheName: "map-tiles",
              expiration: { maxEntries: 400, maxAgeSeconds: 30 * ONE_DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname === "fonts.googleapis.com",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css" },
          },
          {
            urlPattern: ({ url }) => url.hostname === "fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              expiration: { maxEntries: 30, maxAgeSeconds: 365 * ONE_DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Previsión del tiempo: la red primero y, sin conexión, la última guardada.
            urlPattern: ({ url }) => url.hostname === "api.open-meteo.com",
            handler: "NetworkFirst",
            options: {
              cacheName: "weather",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 40, maxAgeSeconds: 3 * ONE_DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  // Rutas relativas: funciona igual en un dominio propio que en https://<usuario>.github.io/<repo>/
  base: "./",
  define: {
    // Fecha de compilación, visible en la app para confirmar qué versión se está viendo.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    rollupOptions: {
      output: {
        // React cambia poco entre versiones de la guía: en su propio archivo se aprovecha la caché del navegador
        manualChunks: { react: ["react", "react-dom"] },
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
