import { expect, test } from "@playwright/test"

import { onePixelPng, rowWith, unique } from "../fixtures/helpers"

const LONG_TEXT =
  "Mesaj de test suficient de lung pentru a trece de validarea serverului, scris în limba română."

test.describe("Formulare publice", () => {
  test("mesajul din /contact ajunge în panou", async ({ page }) => {
    const subject = unique("Subiect contact")

    await page.goto("/contact")
    await page.getByLabel("Nume").fill("Vizitator Test")
    await page.getByLabel("Email").fill("vizitator@exemplu.test")
    await page.getByLabel("Subiect").fill(subject)
    await page.getByLabel("Mesaj").fill(LONG_TEXT)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți mesajul" }).click()

    await expect(page.locator("[data-submission-result]")).toBeVisible()

    await page.goto("/admin/formulare?tip=contact")
    await expect(rowWith(page, subject)).toBeVisible()
    await expect(rowWith(page, subject)).toContainText("vizitator@exemplu.test")
  })

  test("propunerea trimisă public ajunge în panou", async ({ page }) => {
    const title = unique("Propunere publică")

    await page.goto("/propuneri")
    await page.getByLabel("Nume").fill("Propunător Test")
    await page.getByLabel("Email").fill("propunator@exemplu.test")
    await page.getByLabel("Titlul propunerii").fill(title)
    await page.getByLabel("Descriere").fill(LONG_TEXT)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți propunerea" }).click()

    await expect(
      page.getByText("Propunerea a fost înregistrată"),
    ).toBeVisible()

    await page.goto("/admin/propuneri")
    await expect(rowWith(page, title)).toBeVisible()
    await expect(rowWith(page, title)).toContainText("Nou")
  })

  test("formularul din /implica-te ajunge în panou", async ({ page }) => {
    const marker = unique("interes")
    const email = `${marker}@exemplu.test`

    await page.goto("/implica-te")
    // Etichetele conțin și marcajul de câmp obligatoriu, deci țintim id-urile
    // pentru a distinge „Nume” de „Prenume”.
    await page.locator("#firstName").fill("Ana")
    await page.locator("#lastName").fill("Popa")
    await page.locator("#email").fill(email)
    await page.locator("#locality").fill("Cluj-Napoca")
    await page.locator("#message").fill(LONG_TEXT)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți formularul" }).click()

    await expect(page.locator("[data-submission-result]")).toBeVisible()

    await page.goto("/admin/formulare?tip=interes")
    await expect(rowWith(page, email)).toBeVisible()
    await expect(rowWith(page, email)).toContainText("Cluj-Napoca")
  })

  test("cererea din /stergere-cont ajunge în panou", async ({ page }) => {
    const marker = unique("stergere")
    const email = `${marker}@exemplu.test`

    await page.goto("/stergere-cont")
    await page.getByLabel("Adresa de email asociată contului").fill(email)
    await page.getByLabel("Detalii suplimentare").fill(LONG_TEXT)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți cererea" }).click()

    await expect(page.getByText("Cererea a fost înregistrată")).toBeVisible()

    await page.goto("/admin/formulare?tip=stergere")
    await expect(rowWith(page, email)).toBeVisible()
    await expect(rowWith(page, email)).toContainText("Nou")
  })

  test("sesizarea fără fotografie ajunge în panou", async ({ page }) => {
    const subject = unique("Sesizare simplă")

    await page.goto("/sesizari")
    await page.getByLabel("Nume").fill("Sesizant Test")
    await page.getByLabel("Email").fill("sesizant@exemplu.test")
    await page.getByLabel("Subiect").fill(subject)
    await page.getByLabel("Descriere").fill(LONG_TEXT)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți sesizarea" }).click()

    await expect(page.getByText("Sesizarea a fost înregistrată")).toBeVisible()

    await page.goto("/admin/sesizari")
    await expect(rowWith(page, subject)).toBeVisible()
    await expect(rowWith(page, subject)).toContainText("Nu")
  })

  test("sesizarea cu fotografie este marcată și are secțiune dedicată", async ({
    page,
  }) => {
    const subject = unique("Sesizare cu foto")

    await page.goto("/sesizari")
    await page.getByLabel("Nume").fill("Sesizant Foto")
    await page.getByLabel("Email").fill("foto@exemplu.test")
    await page.getByLabel("Subiect").fill(subject)
    await page.getByLabel("Descriere").fill(LONG_TEXT)
    await page.getByLabel("Fotografie").setInputFiles({
      name: "sesizare.png",
      mimeType: "image/png",
      buffer: onePixelPng(),
    })
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți sesizarea" }).click()

    await expect(page.getByText("Sesizarea a fost înregistrată")).toBeVisible()

    await page.goto("/admin/sesizari")
    await expect(rowWith(page, subject)).toContainText("Da")

    await rowWith(page, subject).getByRole("link", { name: "Deschide" }).click()
    // Semnarea URL-ului nu funcționează pe emulator fără service account, deci
    // verificăm doar că secțiunea există și că pagina degradează elegant.
    await expect(page.getByText("Fotografie")).toBeVisible()
  })

  test("un fișier care nu este imagine este respins", async ({ page }) => {
    await page.goto("/sesizari")
    await page.getByLabel("Nume").fill("Sesizant Invalid")
    await page.getByLabel("Email").fill("invalid@exemplu.test")
    await page.getByLabel("Subiect").fill(unique("Fișier invalid"))
    await page.getByLabel("Descriere").fill(LONG_TEXT)
    await page.getByLabel("Fotografie").setInputFiles({
      name: "document.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 conținut fals"),
    })
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Trimiteți sesizarea" }).click()

    await expect(page.locator("#photo-error")).toBeVisible()
    await expect(page.getByText("Sesizarea a fost înregistrată")).toBeHidden()
  })

  test("formularul de contact validează câmpurile obligatorii", async ({
    page,
  }) => {
    await page.goto("/contact")
    await page.getByRole("button", { name: "Trimiteți mesajul" }).click()

    await expect(page.locator("#name-error")).toBeVisible()
    await expect(page.locator("#email-error")).toBeVisible()
    await expect(page.locator("#privacy-error")).toBeVisible()
  })

  test("acordul de confidențialitate este obligatoriu", async ({ page }) => {
    await page.goto("/propuneri")
    await page.getByLabel("Nume").fill("Fără acord")
    await page.getByLabel("Email").fill("fara.acord@exemplu.test")
    await page.getByLabel("Titlul propunerii").fill(unique("Fără acord"))
    await page.getByLabel("Descriere").fill(LONG_TEXT)
    await page.getByRole("button", { name: "Trimiteți propunerea" }).click()

    await expect(page.locator("#privacy-error")).toBeVisible()
    await expect(page.getByText("Propunerea a fost înregistrată")).toBeHidden()
  })
})
