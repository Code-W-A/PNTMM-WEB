import { expect, test } from "@playwright/test"

import { USERS } from "../fixtures/e2e-config"

/**
 * Autentificarea se testează fără sesiunea salvată, deci fiecare test pornește
 * dintr-un context gol.
 *
 * Login-ul și deconectarea folosesc `USERS.sessionAdmin`, nu contul principal:
 * deconectarea revocă token-urile contului, iar sesiunile sunt verificate cu
 * `checkRevoked`, deci ar invalida `storageState`-ul folosit de restul suitei.
 */
test.use({ storageState: { cookies: [], origins: [] } })

test.describe("Autentificare și protejarea panoului", () => {
  test("panoul redirectează vizitatorii fără sesiune către login", async ({
    page,
  }) => {
    await page.goto("/admin")

    await expect(page).toHaveURL(/\/admin\/login$/)
    await expect(
      page.getByRole("heading", { name: "Panou de administrare" }),
    ).toBeVisible()
  })

  test("ruta cerută este păstrată în parametrul redirect", async ({ page }) => {
    await page.goto("/admin/stiri")

    await expect(page).toHaveURL("/admin/login?redirect=%2Fadmin%2Fstiri")
  })

  test("parola greșită afișează o eroare și nu creează sesiune", async ({
    page,
  }) => {
    await page.goto("/admin/login")

    await page.getByLabel("Email").fill(USERS.admin.email)
    await page.getByLabel("Parolă").fill("parola-gresita")
    await page.getByRole("button", { name: "Autentificare" }).click()

    // `getByRole("alert")` ar prinde și route announcer-ul Next, care e gol.
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Autentificare eșuată",
    )
    await expect(page).toHaveURL(/\/admin\/login/)

    const cookies = await page.context().cookies()
    expect(cookies.find((cookie) => cookie.name === "pntmm_session")).toBeUndefined()
  })

  test("un cont valid fără drepturi de administrare este respins", async ({
    page,
  }) => {
    await page.goto("/admin/login")

    await page.getByLabel("Email").fill(USERS.nonAdmin.email)
    await page.getByLabel("Parolă").fill(USERS.nonAdmin.password)
    await page.getByRole("button", { name: "Autentificare" }).click()

    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Contul nu are drepturi de administrare.",
    )
    await expect(page).toHaveURL(/\/admin\/login/)

    const cookies = await page.context().cookies()
    expect(cookies.find((cookie) => cookie.name === "pntmm_session")).toBeUndefined()
  })

  test("câmpurile goale sunt validate în client", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByRole("button", { name: "Autentificare" }).click()

    await expect(page.getByText("Introduceți adresa de email.")).toBeVisible()
    await expect(page.getByText("Introduceți parola.")).toBeVisible()
  })

  test("login corect creează o sesiune HttpOnly și deschide panoul", async ({
    page,
  }) => {
    await page.goto("/admin/login")

    await page.getByLabel("Email").fill(USERS.sessionAdmin.email)
    await page.getByLabel("Parolă").fill(USERS.sessionAdmin.password)
    await page.getByRole("button", { name: "Autentificare" }).click()

    await page.waitForURL("**/admin")
    await expect(
      page.getByRole("heading", { name: "Panou de administrare" }),
    ).toBeVisible()

    const session = (await page.context().cookies()).find(
      (cookie) => cookie.name === "pntmm_session",
    )

    expect(session).toBeDefined()
    expect(session?.httpOnly).toBe(true)
  })

  test("deconectarea invalidează accesul la panou", async ({ page }) => {
    await page.goto("/admin/login")
    await page.getByLabel("Email").fill(USERS.sessionAdmin.email)
    await page.getByLabel("Parolă").fill(USERS.sessionAdmin.password)
    await page.getByRole("button", { name: "Autentificare" }).click()
    await page.waitForURL("**/admin")

    await page.getByRole("button", { name: "Deconectare" }).click()
    await page.waitForURL("**/admin/login**")

    await page.goto("/admin/stiri")
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})
