import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Deployed to https://jlimo17.github.io/talanoa_toolkit/ — base must match the repo name exactly.
  base: "/talanoa_toolkit/",
});
