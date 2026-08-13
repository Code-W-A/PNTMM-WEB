import { resolve } from "node:path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      // `server-only` aruncă la import în afara unui Server Component; în
      // teste îl înlocuim cu un modul gol.
      "server-only": resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
})
