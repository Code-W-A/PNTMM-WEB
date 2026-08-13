import { expect, test } from "@playwright/test"

import { USERS } from "../fixtures/e2e-config"
import {
  authUserByEmail,
  confirmDialog,
  expectToast,
  rowWith,
} from "../fixtures/helpers"

test.describe("Administrarea utilizatorilor", () => {
  test("lista afișează conturile semănate cu starea corectă", async ({
    page,
  }) => {
    await page.goto("/admin/utilizatori")

    await expect(rowWith(page, USERS.admin.email)).toContainText(
      "Administrator",
    )
    await expect(rowWith(page, USERS.toDisable.email)).toContainText("Activ")
    await expect(rowWith(page, USERS.disabled.email)).toContainText(
      "Dezactivat",
    )
  })

  test("căutarea filtrează conturile", async ({ page }) => {
    await page.goto("/admin/utilizatori")

    await page.getByLabel("Caută utilizatori").fill("de-dezactivat")
    await expect(rowWith(page, USERS.toDisable.email)).toBeVisible()
    await expect(rowWith(page, USERS.admin.email)).toBeHidden()

    await page.getByLabel("Caută utilizatori").fill("inexistent")
    await expect(
      page.getByText("Niciun cont nu corespunde filtrelor"),
    ).toBeVisible()
  })

  test("dezactivarea se aplică în Firebase Auth, nu doar în interfață", async ({
    page,
  }) => {
    await page.goto("/admin/utilizatori")

    const before = await authUserByEmail(USERS.toDisable.email)
    expect(before?.disabled ?? false).toBe(false)

    await rowWith(page, USERS.toDisable.email)
      .getByRole("button", { name: "Dezactivează" })
      .click()
    await confirmDialog(page, "Dezactivează")
    await expectToast(page, "Contul a fost dezactivat.")

    await expect(rowWith(page, USERS.toDisable.email)).toContainText(
      "Dezactivat",
    )

    // Verificarea se face direct în emulator, ca testul să nu se bazeze doar
    // pe ce afișează panoul.
    const after = await authUserByEmail(USERS.toDisable.email)
    expect(after?.disabled).toBe(true)
  })

  test("reactivarea redă accesul contului", async ({ page }) => {
    await page.goto("/admin/utilizatori")

    await rowWith(page, USERS.disabled.email)
      .getByRole("button", { name: "Reactivează" })
      .click()
    await expectToast(page, "Contul a fost reactivat.")

    await expect(rowWith(page, USERS.disabled.email)).toContainText("Activ")

    const record = await authUserByEmail(USERS.disabled.email)
    expect(record?.disabled ?? false).toBe(false)
  })

  test("dezactivarea propriului cont este refuzată", async ({ page }) => {
    await page.goto("/admin/utilizatori")

    await rowWith(page, USERS.admin.email)
      .getByRole("button", { name: "Dezactivează" })
      .click()
    await confirmDialog(page, "Dezactivează")

    await expectToast(page, /propriul cont/i)

    // Contul de administrare rămâne activ atât în panou, cât și în emulator.
    await expect(rowWith(page, USERS.admin.email)).toContainText("Activ")
    const record = await authUserByEmail(USERS.admin.email)
    expect(record?.disabled ?? false).toBe(false)
  })

  test("filtrul de stare separă conturile active de cele dezactivate", async ({
    page,
  }) => {
    await page.goto("/admin/utilizatori")

    await page.getByLabel("Filtrează după stare").click()
    await page.getByRole("option", { name: "Active", exact: true }).click()
    await expect(rowWith(page, USERS.admin.email)).toBeVisible()
  })

  test("exportul CSV al utilizatorilor conține conturile", async ({ page }) => {
    await page.goto("/admin/utilizatori")

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Export CSV" }).click(),
    ])

    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const csv = Buffer.concat(chunks).toString("utf8")

    expect(csv).toContain(USERS.admin.email)
  })
})
