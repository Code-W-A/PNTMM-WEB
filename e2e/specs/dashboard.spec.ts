import { expect, test, type Page } from "@playwright/test"

import { SEED } from "../fixtures/e2e-config"

/**
 * Aserțiunile sunt relative, nu pe numere fixe: celelalte suite adaugă date în
 * aceeași bază, deci un KPI exact ar fi fragil.
 */
/** Cardul de indicator, distinct de secțiunile care poartă titluri similare. */
function statCard(page: Page, label: string) {
  return page.locator("div.rounded-xl").filter({ hasText: label }).first()
}

async function statValue(page: Page, label: string): Promise<number> {
  const value = await statCard(page, label).locator("p.tabular-nums").innerText()
  return Number(value.trim())
}

test.describe("Panoul principal", () => {
  test("afișează cele patru indicatoare", async ({ page }) => {
    await page.goto("/admin")

    for (const label of [
      "Știri publicate",
      "Evenimente viitoare",
      "Sesizări noi",
      "Propuneri noi",
    ]) {
      await expect(statCard(page, label)).toBeVisible()
    }

    expect(await statValue(page, "Știri publicate")).toBeGreaterThanOrEqual(1)
    expect(await statValue(page, "Evenimente viitoare")).toBeGreaterThanOrEqual(
      1,
    )
  })

  test("indicatorul de știri crește după publicare", async ({ page }) => {
    await page.goto("/admin")
    const before = await statValue(page, "Știri publicate")

    await page.goto("/admin/stiri/nou")
    const slug = `kpi-${Date.now().toString(36)}`
    await page.getByLabel("Titlu").fill(`Știre pentru indicator ${slug}`)
    await page.getByLabel("Slug").fill(slug)
    await page.getByLabel("Rezumat").fill("Rezumat pentru verificarea KPI-ului.")
    await page
      .getByLabel("Conținut")
      .fill("Conținut suficient de lung pentru validarea serverului.")
    await page.getByLabel("Categorie").fill("Comunicate")
    await page.getByLabel("Stare").click()
    await page.getByRole("option", { name: "Publicat", exact: true }).click()
    await page.getByRole("button", { name: "Creează știrea" }).click()
    await page.waitForURL("**/admin/stiri")

    await page.goto("/admin")
    expect(await statValue(page, "Știri publicate")).toBe(before + 1)
  })

  test("secțiunea Necesită atenție duce la detaliul solicitării", async ({
    page,
  }) => {
    await page.goto("/admin")

    const section = page
      .locator("section", { hasText: "Necesită atenție" })
      .first()
    const first = section.getByRole("link").first()
    await expect(first).toBeVisible()

    await first.click()
    await expect(page).toHaveURL(
      /\/admin\/(sesizari|propuneri|formulare)\/.+/,
    )
  })

  test("acțiunile rapide duc la formularele de creare", async ({ page }) => {
    await page.goto("/admin")

    await page.getByRole("link", { name: "Adaugă știre" }).first().click()
    await expect(page).toHaveURL(/\/admin\/stiri\/nou/)

    await page.goto("/admin")
    await page.getByRole("link", { name: "Adaugă eveniment" }).first().click()
    await expect(page).toHaveURL(/\/admin\/evenimente\/nou/)
  })

  test("evenimentele viitoare și conținutul recent listează datele semănate", async ({
    page,
  }) => {
    await page.goto("/admin")

    const events = page
      .locator("section", { hasText: "Evenimente viitoare" })
      .last()
    await expect(
      events.getByText(SEED.upcomingEvent.title, { exact: true }),
    ).toBeVisible()
    // Evenimentul încheiat nu are ce căuta în lista celor viitoare.
    await expect(events.getByText(SEED.pastEvent.title)).toBeHidden()

    const news = page.locator("section", { hasText: "Conținut recent" }).last()
    await expect(news.getByRole("link").first()).toBeVisible()
  })

  test("linkurile Toate duc la listele complete", async ({ page }) => {
    await page.goto("/admin")

    const events = page
      .locator("section", { hasText: "Evenimente viitoare" })
      .last()
    await events.getByRole("link", { name: "Toate" }).click()
    await expect(page).toHaveURL(/\/admin\/evenimente$/)
  })
})
