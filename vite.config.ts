/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
    include: ["src/**/*.test.ts"],
  },
});
