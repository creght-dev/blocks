import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { codeInspectorPlugin } from "code-inspector-plugin"

export default defineConfig({
  plugins: [
    react(),
    codeInspectorPlugin({
      bundler: "vite",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
