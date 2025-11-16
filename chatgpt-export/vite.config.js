// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: Fix paths when loading the app through file:// in Electron
  base: "./",

  build: {
    outDir: "dist",
  },

  server: {
    port: 5173,
  },
});
