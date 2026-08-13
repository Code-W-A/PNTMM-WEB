import { resolve } from "node:path"

import { defineConfig } from "vitest/config"

/**
 * Testele de reguli au nevoie de emulatorul Firestore pornit:
 *   npm run emulators
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/rules/**/*.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    fileParallelism: false,
  },
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
})
