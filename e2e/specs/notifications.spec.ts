import { expect, test } from "@playwright/test"

import { confirmDialog, expectToast, rowWith, unique } from "../fixtures/helpers"

test.describe("Notificări", () => {
  test("trimiterea cere confirmare și ajunge în istoric", async ({ page }) => {
    const title = unique("Notificare")

    await page.goto("/admin/notificari")
    await page.getByLabel("Titlu").fill(title)
    await page
      .getByLabel("Mesaj")
      .fill("Mesaj de test pentru utilizatorii aplicației mobile.")

    await page.getByRole("button", { name: "Trimite notificarea" }).click()
    await confirmDialog(page, "Trimite")
    await expectToast(page, "Notificarea a fost trimisă.")

    const row = rowWith(page, title)
    await expect(row).toBeVisible()
    await expect(row).toContainText("Trimisă")
    // Fără tokenuri de push semănate, trimiterea se închide cu zero destinatari
    // și fără apel către FCM.
    await expect(row).toContainText("0")
  })

  test("anularea în dialog nu trimite nimic", async ({ page }) => {
    const title = unique("Notificare anulată")

    await page.goto("/admin/notificari")
    await page.getByLabel("Titlu").fill(title)
    await page.getByLabel("Mesaj").fill("Acest mesaj nu trebuie trimis.")

    await page.getByRole("button", { name: "Trimite notificarea" }).click()
    const dialog = page.getByRole("alertdialog")
    await expect(dialog).toBeVisible()
    await dialog.getByRole("button", { name: "Anulează" }).click()
    await expect(dialog).toBeHidden()

    await page.reload()
    await expect(rowWith(page, title)).toBeHidden()
  })

  test("formularul validează câmpurile goale", async ({ page }) => {
    await page.goto("/admin/notificari")
    await page.getByRole("button", { name: "Trimite notificarea" }).click()

    await expect(page.locator("#title-error")).toBeVisible()
    await expect(page.locator("#body-error")).toBeVisible()
    await expect(page.getByRole("alertdialog")).toBeHidden()
  })

  test("contorul de caractere reflectă textul introdus", async ({ page }) => {
    await page.goto("/admin/notificari")
    await page.getByLabel("Titlu").fill("Anunț")

    await expect(page.getByText("5 / 120")).toBeVisible()
  })
})
