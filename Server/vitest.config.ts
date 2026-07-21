import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      // Directs any import starting with '@/' to the './src/' folder
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
