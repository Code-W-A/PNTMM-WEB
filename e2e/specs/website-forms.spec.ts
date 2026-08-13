import { expect, test } from "@playwright/test"

import { SEED } from "../fixtures/e2e-config"
import { chooseOption, expectToast, rowWith } from "../fixtures/helpers"

test.describe("Formulare website în panou", () => {
  test("taburile afișează numărători și schimbă tabelul", async ({ page }) => {
    await page.goto("/admin/formulare")

    const tabs = page.getByRole("navigation").first()
    await expect(tabs.getByRole("link", { name: /Contact/ })).toBeVisible()
    await expect(tabs.getByRole("link", { name: /Interes/ })).toBeVisible()
    await expect(
      tabs.getByRole("link", { name: /Cereri de ștergere/ }),
    ).toBeVisible()

    await expect(rowWith(page, SEED.contactMessage.subject)).toBeVisible()

    await tabs.getByRole("link", { name: /Interes/ }).click()
    await expect(page).toHaveURL(/tip=interes/)
    await expect(rowWith(page, SEED.interestSubmission.email)).toBeVisible()

    await tabs.getByRole("link", { name: /Cereri de ștergere/ }).click()
    await expect(page).toHaveURL(/tip=stergere/)
    await expect(rowWith(page, SEED.deletionRequest.email)).toBeVisible()
  })

  test("detaliul mesajului de contact afișează datele trimise", async ({
    page,
  }) => {
    await page.goto("/admin/formulare?tip=contact")
    await rowWith(page, SEED.contactMessage.subject)
      .getByRole("link", { name: "Deschide" })
      .click()

    await expect(
      page.getByRole("heading", { name: SEED.contactMessage.subject }),
    ).toBeVisible()
    await expect(page.getByText("Elena Rusu")).toBeVisible()
    await expect(page.getByText("elena.rusu@exemplu.test")).toBeVisible()
    await expect(page.getByText("programul de audiențe")).toBeVisible()
  })

  test("detaliul formularului de interes afișează localitatea", async ({
    page,
  }) => {
    await page.goto("/admin/formulare?tip=interes")
    await rowWith(page, SEED.interestSubmission.email)
      .getByRole("link", { name: "Deschide" })
      .click()

    await page.waitForURL("**/admin/formulare/interes/**")
    await expect(
      page.getByRole("heading", { name: "Radu Chindriș" }),
    ).toBeVisible()
    await expect(page.getByText("Florești")).toBeVisible()
    await expect(page.getByText("voluntariat")).toBeVisible()
  })

  test("cererea de ștergere are selector de status funcțional", async ({
    page,
  }) => {
    await page.goto("/admin/formulare?tip=stergere")
    await rowWith(page, SEED.deletionRequest.email)
      .getByRole("link", { name: "Deschide" })
      .click()

    await chooseOption(page.getByLabel("Status"), "În lucru")
    await expectToast(page, "Statusul a fost actualizat.")

    await page.reload()
    await expect(page.getByLabel("Status")).toContainText("În lucru")

    await chooseOption(page.getByLabel("Status"), "Nou")
    await expectToast(page, "Statusul a fost actualizat.")
  })

  test("căutarea filtrează mesajele de contact", async ({ page }) => {
    await page.goto("/admin/formulare?tip=contact")

    await page.getByLabel("Caută în mesajele de contact").fill("Elena")
    await expect(rowWith(page, SEED.contactMessage.subject)).toBeVisible()

    await page.getByLabel("Caută în mesajele de contact").fill("inexistent")
    await expect(
      page.getByText("Niciun mesaj nu corespunde căutării"),
    ).toBeVisible()
  })
})
