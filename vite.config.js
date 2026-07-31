import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // If you deploy to GitHub Pages at https://<user>.github.io/talanoa-toolkit/,
  // uncomment the line below so built asset paths resolve correctly:
  // base: "/talanoa-toolkit/",
});
