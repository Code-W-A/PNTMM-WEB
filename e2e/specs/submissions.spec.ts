import { expect, test } from "@playwright/test"

import { SEED } from "../fixtures/e2e-config"
import { chooseOption, expectToast, rowWith } from "../fixtures/helpers"

test.describe("Sesizări și propuneri", () => {
  test("statusul unei sesizări se schimbă și persistă", async ({ page }) => {
    await page.goto("/admin/sesizari")
    await rowWith(page, SEED.newReport.subject)
      .getByRole("link", { name: "Deschide" })
      .click()

    await expect(
      page.getByRole("heading", { name: SEED.newReport.subject }),
    ).toBeVisible()

    await chooseOption(page.getByLabel("Status"), "În lucru")
    await expectToast(page, "Statusul a fost actualizat.")

    await page.reload()
    await expect(page.getByLabel("Status")).toContainText("În lucru")

    // Readucem sesizarea la starea inițială, ca celelalte teste să nu depindă
    // de ordinea de rulare.
    await chooseOption(page.getByLabel("Status"), "Nou")
    await expectToast(page, "Statusul a fost actualizat.")
  })

  test("lista de sesizări reflectă statusul după schimbare", async ({
    page,
  }) => {
    await page.goto("/admin/sesizari")
    await rowWith(page, SEED.closedReport.subject)
      .getByRole("link", { name: "Deschide" })
      .click()

    await chooseOption(page.getByLabel("Status"), "În lucru")
    await expectToast(page, "Statusul a fost actualizat.")

    await page.goto("/admin/sesizari")
    await expect(rowWith(page, SEED.closedReport.subject)).toContainText(
      "În lucru",
    )

    await rowWith(page, SEED.closedReport.subject)
      .getByRole("link", { name: "Deschide" })
      .click()
    await chooseOption(page.getByLabel("Status"), "Închis")
    await expectToast(page, "Statusul a fost actualizat.")
  })

  test("filtrul de status restrânge lista de sesizări", async ({ page }) => {
    await page.goto("/admin/sesizari")

    await chooseOption(page.getByLabel("Filtrează după status"), "Închis")
    await expect(rowWith(page, SEED.closedReport.subject)).toBeVisible()
    await expect(rowWith(page, SEED.newReport.subject)).toBeHidden()

    await chooseOption(page.getByLabel("Filtrează după status"), "Nou")
    await expect(rowWith(page, SEED.newReport.subject)).toBeVisible()
    await expect(rowWith(page, SEED.closedReport.subject)).toBeHidden()
  })

  test("detaliul sesizării afișează expeditorul și nu regimul de date", async ({
    page,
  }) => {
    await page.goto("/admin/sesizari")
    await rowWith(page, SEED.newReport.subject)
      .getByRole("link", { name: "Deschide" })
      .click()

    await expect(page.getByText("Ioana Popescu")).toBeVisible()
    await expect(page.getByText("ioana.popescu@exemplu.test")).toBeVisible()
    await expect(page.getByText("Regim date")).toBeHidden()
  })

  test("statusul unei propuneri se schimbă și persistă", async ({ page }) => {
    await page.goto("/admin/propuneri")
    await rowWith(page, SEED.newProposal.title)
      .getByRole("link", { name: "Deschide" })
      .click()

    await chooseOption(page.getByLabel("Status"), "Închis")
    await expectToast(page, "Statusul a fost actualizat.")

    await page.reload()
    await expect(page.getByLabel("Status")).toContainText("Închis")

    await chooseOption(page.getByLabel("Status"), "Nou")
    await expectToast(page, "Statusul a fost actualizat.")
  })

  test("căutarea găsește propunerea după titlu", async ({ page }) => {
    await page.goto("/admin/propuneri")

    await page.getByLabel("Caută în propuneri").fill("biciclete")
    await expect(rowWith(page, SEED.newProposal.title)).toBeVisible()

    await page.getByLabel("Caută în propuneri").fill("termen inexistent")
    await expect(
      page.getByText("Nicio propunere nu corespunde filtrelor"),
    ).toBeVisible()
  })

  test("exportul CSV al sesizărilor conține datele reale", async ({ page }) => {
    await page.goto("/admin/sesizari")

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Export CSV" }).click(),
    ])

    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const csv = Buffer.concat(chunks).toString("utf8")

    expect(csv).toContain(SEED.newReport.subject)
    expect(csv).toContain("ioana.popescu@exemplu.test")
  })

  test("exportul CSV al propunerilor conține datele reale", async ({
    page,
  }) => {
    await page.goto("/admin/propuneri")

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Export CSV" }).click(),
    ])

    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const csv = Buffer.concat(chunks).toString("utf8")

    expect(csv).toContain(SEED.newProposal.title)
  })
})
