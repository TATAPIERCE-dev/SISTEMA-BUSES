import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import adonisjs from "@adonisjs/vite/client";
import inertia from "@adonisjs/inertia/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    inertia({ ssr: { enabled: false, entrypoint: "inertia/ssr.tsx" } }),
    adonisjs({ entrypoints: ["inertia/app/app.tsx"], reload: ["resources/views/**/*.edge"] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      "~/generated": `${import.meta.dirname}/.adonisjs/client`,
      "~/": `${import.meta.dirname}/inertia/`,
      "@/": `${import.meta.dirname}/inertia/`,
      "@": path.resolve(import.meta.dirname, "inertia"),
      "@assets/": `${import.meta.dirname}/inertia/assets/`,
      "~registry": `${import.meta.dirname}/.adonisjs/client/index.ts`,
      "@translations/*": `${import.meta.dirname}/resources/lang/*`,
    },
  },
});
