import { defineConfig, devices } from "@playwright/test"

// Configurația E2E este scrisă în CommonJS ca să fie citită identic de
// orchestrator, de scriptul de seed și de aici.
import e2eConfig from "./scripts/e2e-env.cjs"

const { E2E_BASE_URL, E2E_PORT, withE2eEnv } = e2eConfig

const ADMIN_STATE = "e2e/.auth/admin.json"

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",

  // Testele scriu în aceeași bază de date; determinismul contează mai mult
  // decât paralelismul la această dimensiune a suitei.
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 10_000 },

  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: E2E_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
    locale: "ro-RO",
    timezoneId: "Europe/Bucharest",
  },

  projects: [
    {
      name: "setup",
      testMatch: /setup\/auth\.setup\.ts/,
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testMatch: /specs\/.*\.spec\.ts/,
      testIgnore: /specs\/mobile-.*\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: ADMIN_STATE,
      },
    },
    {
      name: "mobile",
      dependencies: ["setup"],
      testMatch: /specs\/mobile-.*\.spec\.ts/,
      use: {
        ...devices["Pixel 5"],
        storageState: ADMIN_STATE,
      },
    },
  ],

  webServer: {
    command: `npx next start --port ${E2E_PORT}`,
    url: E2E_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
    env: withE2eEnv(),
  },
})
