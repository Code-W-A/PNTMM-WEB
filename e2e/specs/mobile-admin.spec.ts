import { expect, test } from "@playwright/test"

/**
 * Rulează doar în proiectul `mobile`, pe un viewport de telefon, unde sidebarul
 * devine sertar.
 */
test.describe("Panoul pe mobil", () => {
  test("sidebarul este ascuns și se deschide ca sertar", async ({ page }) => {
    await page.goto("/admin")

    const trigger = page.getByRole("button", { name: "Comută navigarea" })
    await expect(trigger).toBeVisible()

    // Sertarul este montat abia la deschidere.
    await expect(page.getByRole("dialog")).toHaveCount(0)

    await trigger.click()
    const drawer = page.getByRole("dialog")
    await expect(drawer).toBeVisible()
    await expect(drawer.getByRole("link", { name: "Știri" })).toBeVisible()
  })

  test("sertarul se închide după navigare", async ({ page }) => {
    await page.goto("/admin")

    await page.getByRole("button", { name: "Comută navigarea" }).click()
    const drawer = page.getByRole("dialog")
    await drawer.getByRole("link", { name: "Evenimente" }).click()

    await expect(page).toHaveURL(/\/admin\/evenimente$/)
    await expect(page.getByRole("dialog")).toBeHidden()
  })

  test("titlul secțiunii curente apare în bara de sus", async ({ page }) => {
    await page.goto("/admin/sesizari")

    // Bara este un `header` în interiorul lui `main`, deci nu este un landmark
    // de tip banner; o țintim ca element.
    await expect(page.locator("header").first()).toContainText("Sesizări")
  })

  test("tabelele rămân utilizabile fără depășirea ecranului", async ({
    page,
  }) => {
    await page.goto("/admin/stiri")

    const overflowsHorizontally = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    )

    expect(overflowsHorizontally).toBe(false)
  })

  test("sertarul are titlu accesibil pentru cititoarele de ecran", async ({
    page,
  }) => {
    await page.goto("/admin")
    await page.getByRole("button", { name: "Comută navigarea" }).click()

    await expect(page.getByRole("dialog", { name: "Navigare" })).toBeVisible()
  })
})
