import { expect, test, type Page } from "@playwright/test"

import { SEED } from "../fixtures/e2e-config"
import {
  chooseOption,
  confirmDialog,
  dateTimeLocal,
  expectToast,
  onePixelPng,
  rowWith,
  unique,
} from "../fixtures/helpers"

const DESCRIPTION =
  "Descrierea completă a evenimentului, suficient de lungă pentru validarea serverului."

interface EventInput {
  slug: string
  title: string
  status?: "Ciornă" | "Publicat"
  registration?: boolean
  endDate?: string
}

async function fillEventForm(
  page: Page,
  { slug, title, status, registration, endDate }: EventInput,
) {
  await page.getByLabel("Titlu").fill(title)
  await page.getByLabel("Slug").fill(slug)
  await page.getByLabel("Descriere").fill(DESCRIPTION)
  await page.getByLabel("Început").fill(dateTimeLocal(10))

  if (endDate) {
    await page.getByLabel("Final").fill(endDate)
  }

  await page.getByLabel("Locație").fill("Cluj-Napoca")

  if (status) {
    await chooseOption(page.getByLabel("Stare"), status)
  }

  if (registration) {
    await page.getByRole("checkbox", { name: "Înscriere activă" }).check()
  }
}

async function createEvent(page: Page, input: EventInput) {
  await page.goto("/admin/evenimente/nou")
  await fillEventForm(page, input)
  await page.getByRole("button", { name: "Creează evenimentul" }).click()
  await page.waitForURL("**/admin/evenimente")
}

test.describe("CRUD evenimente", () => {
  test("creează un eveniment și îl afișează în listă", async ({ page }) => {
    const slug = unique("eveniment-nou")
    const title = `Eveniment de test ${slug}`

    await createEvent(page, { slug, title })

    const row = rowWith(page, title)
    await expect(row).toBeVisible()
    await expect(row).toContainText("Ciornă")
    await expect(row).toContainText("Cluj-Napoca")
  })

  test("un final anterior începutului este respins", async ({ page }) => {
    await page.goto("/admin/evenimente/nou")
    await fillEventForm(page, {
      slug: unique("date-inversate"),
      title: "Eveniment cu date inversate",
      endDate: dateTimeLocal(2),
    })
    await page.getByRole("button", { name: "Creează evenimentul" }).click()

    await expect(page).toHaveURL(/\/admin\/evenimente\/nou/)
    await expect(page.locator("#endDate-error")).toBeVisible()
  })

  test("un eveniment fără dată de final se afișează public", async ({
    page,
  }) => {
    const slug = unique("fara-final")
    const title = `Eveniment fără final ${slug}`

    await createEvent(page, { slug, title, status: "Publicat" })

    const response = await page.goto(`/evenimente/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.getByRole("heading", { name: title })).toBeVisible()
    await expect(page.getByText("Se încheie")).toBeHidden()
  })

  test("ciorna de eveniment nu ajunge pe website", async ({ page }) => {
    const slug = unique("eveniment-ciorna")

    await createEvent(page, { slug, title: `Ciornă eveniment ${slug}` })

    const response = await page.goto(`/evenimente/${slug}`)
    expect(response?.status()).toBe(404)
  })

  test("înscrierea publică ajunge în lista de participanți", async ({
    page,
  }) => {
    const slug = unique("cu-inscriere")
    const title = `Eveniment cu înscriere ${slug}`
    const participant = `Participant ${slug}`
    const email = `${slug}@exemplu.test`

    await createEvent(page, {
      slug,
      title,
      status: "Publicat",
      registration: true,
    })

    await page.goto(`/evenimente/${slug}`)
    await expect(
      page.getByRole("heading", { name: "Înscriere la eveniment" }),
    ).toBeVisible()

    await page.getByLabel("Nume").fill(participant)
    await page.getByLabel("Email").fill(email)
    await page.getByLabel(/Am citit și accept/).check()
    await page.getByRole("button", { name: "Mă înscriu" }).click()

    await expect(page.locator("[data-submission-result]")).toContainText(
      "Înscrierea a fost înregistrată.",
    )

    await page.goto("/admin/evenimente")
    await rowWith(page, title).getByRole("link", { name: "Vezi lista" }).click()

    await expect(page.getByRole("cell", { name: participant })).toBeVisible()
    await expect(page.getByRole("cell", { name: email })).toBeVisible()
  })

  test("dezactivarea înscrierii închide formularul public", async ({
    page,
  }) => {
    const slug = unique("inscriere-inchisa")
    const title = `Înscriere de închis ${slug}`

    await createEvent(page, {
      slug,
      title,
      status: "Publicat",
      registration: true,
    })

    await rowWith(page, title)
      .getByRole("link", { name: "Editează evenimentul" })
      .click()
    await page.getByRole("checkbox", { name: "Înscriere activă" }).uncheck()
    await page.getByRole("button", { name: "Salvează modificările" }).click()
    await expectToast(page, "Evenimentul a fost actualizat.")

    await page.goto(`/evenimente/${slug}`)
    await expect(
      page.getByText("Înscrierea online nu este activă pentru acest eveniment."),
    ).toBeVisible()
  })

  test("exportul CSV al participanților conține înscrierile", async ({
    page,
  }) => {
    await page.goto(
      `/admin/evenimente/${SEED.upcomingEvent.id}/participanti`,
    )

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("link", { name: "Export CSV" }).click(),
    ])

    const stream = await download.createReadStream()
    const chunks: Buffer[] = []
    for await (const chunk of stream) chunks.push(Buffer.from(chunk))
    const csv = Buffer.concat(chunks).toString("utf8")

    expect(csv).toContain(SEED.registrations[0].email)
    expect(csv).toContain(SEED.registrations[1].email)
  })

  test("filtrul după dată separă evenimentele viitoare de cele încheiate", async ({
    page,
  }) => {
    await page.goto("/admin/evenimente")

    await chooseOption(page.getByLabel("Filtrează după dată"), "Viitoare")
    await expect(rowWith(page, SEED.upcomingEvent.title)).toBeVisible()
    await expect(rowWith(page, SEED.pastEvent.title)).toBeHidden()

    await chooseOption(page.getByLabel("Filtrează după dată"), "Încheiate")
    await expect(rowWith(page, SEED.pastEvent.title)).toBeVisible()
    await expect(rowWith(page, SEED.upcomingEvent.title)).toBeHidden()
  })

  test("imaginea de copertă se încarcă și se păstrează la editare", async ({
    page,
  }) => {
    const slug = unique("eveniment-imagine")
    const title = `Eveniment cu imagine ${slug}`

    await page.goto("/admin/evenimente/nou")
    await fillEventForm(page, { slug, title })
    await page.getByLabel("Imagine de copertă").setInputFiles({
      name: "coperta.png",
      mimeType: "image/png",
      buffer: onePixelPng(),
    })
    await expect(page.getByAltText("Previzualizare copertă")).toBeVisible()
    await page.getByRole("button", { name: "Creează evenimentul" }).click()
    await page.waitForURL("**/admin/evenimente")

    await rowWith(page, title)
      .getByRole("link", { name: "Editează evenimentul" })
      .click()
    await expect(page.getByAltText("Previzualizare copertă")).toBeVisible()
  })

  test("ștergerea scoate evenimentul din listă și de pe website", async ({
    page,
  }) => {
    const slug = unique("eveniment-sters")
    const title = `Eveniment de șters ${slug}`

    await createEvent(page, { slug, title, status: "Publicat" })

    await rowWith(page, title).getByRole("button", { name: "Șterge" }).click()
    await confirmDialog(page, "Șterge")

    await expect(rowWith(page, title)).toBeHidden()

    const response = await page.goto(`/evenimente/${slug}`)
    expect(response?.status()).toBe(404)
  })
})
