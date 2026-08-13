import { expect, test as setup } from "@playwright/test"

import { ADMIN_STATE_FILE, USERS } from "../fixtures/e2e-config"

/**
 * Sesiunea folosită de restul suitei se obține prin fluxul real de login:
 * Firebase client → `POST /api/auth/session` → cookie HttpOnly `pntmm_session`.
 * Nu injectăm cookie-uri fabricate, ca testele să acopere și autentificarea.
 */
setup("autentificare ca administrator", async ({ page }) => {
  await page.goto("/admin/login")

  await page.getByLabel("Email").fill(USERS.admin.email)
  await page.getByLabel("Parolă").fill(USERS.admin.password)
  await page.getByRole("button", { name: "Autentificare" }).click()

  await page.waitForURL("**/admin")
  await expect(
    page.getByRole("heading", { name: "Panou de administrare" }),
  ).toBeVisible()

  await page.context().storageState({ path: ADMIN_STATE_FILE })
})
