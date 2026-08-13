import { expect, test, type Page } from "@playwright/test"

import { SEED } from "../fixtures/e2e-config"
import {
  chooseOption,
  confirmDialog,
  expectToast,
  rowWith,
  unique,
} from "../fixtures/helpers"

const CONTENT =
  "Conținutul complet al articolului, suficient de lung cât să treacă de validarea serverului."

interface NewsInput {
  slug: string
  title: string
  status?: "Ciornă" | "Publicat"
}

async function fillNewsForm(page: Page, { slug, title, status }: NewsInput) {
  await page.getByLabel("Titlu").fill(title)
  // Slug-ul se completează automat din titlu, deci îl scriem după.
  await page.getByLabel("Slug").fill(slug)
  await page
    .getByLabel("Rezumat")
    .fill("Rezumat scurt folosit în listele publice și în căutare.")
  await page.getByLabel("Conținut").fill(CONTENT)
  await page.getByLabel("Categorie").fill("Comunicate")

  if (status) {
    await chooseOption(page.getByLabel("Stare"), status)
  }
}

async function createNews(page: Page, input: NewsInput) {
  await page.goto("/admin/stiri/nou")
  await fillNewsForm(page, input)
  await page.getByRole("button", { name: "Creează știrea" }).click()
  await page.waitForURL("**/admin/stiri")
}

test.describe("CRUD știri", () => {
  test("creează o ciornă și o afișează în listă", async ({ page }) => {
    const slug = unique("stire-noua")
    const title = `Știre de test ${slug}`

    await createNews(page, { slug, title })

    const row = rowWith(page, title)
    await expect(row).toBeVisible()
    await expect(row).toContainText("Ciornă")
  })

  test("editarea persistă după reîncărcare", async ({ page }) => {
    const slug = unique("stire-editata")
    const title = `Titlu inițial ${slug}`
    const updated = `Titlu actualizat ${slug}`

    await createNews(page, { slug, title })
    await rowWith(page, title).getByRole("link", { name: "Editează știrea" }).click()

    await page.getByLabel("Titlu").fill(updated)
    await page.getByRole("button", { name: "Salvează modificările" }).click()
    await expectToast(page, "Știrea a fost actualizată.")

    await page.reload()
    await expect(page.getByLabel("Titlu")).toHaveValue(updated)
  })

  test("indicatorul de modificări nesalvate apare la editare", async ({
    page,
  }) => {
    const slug = unique("stire-dirty")
    await createNews(page, { slug, title: `Titlu dirty ${slug}` })

    await rowWith(page, slug).getByRole("link", { name: "Editează știrea" }).click()
    await expect(page.getByText("Modificări nesalvate")).toBeHidden()

    await page.getByLabel("Categorie").fill("Altă categorie")
    await expect(page.getByText("Modificări nesalvate")).toBeVisible()
  })

  test("o știre publicată apare pe website", async ({ page }) => {
    const slug = unique("stire-publica")
    const title = `Anunț public ${slug}`

    await createNews(page, { slug, title, status: "Publicat" })

    await page.goto("/stiri")
    await expect(page.getByRole("heading", { name: title })).toBeVisible()

    await page.goto(`/stiri/${slug}`)
    await expect(page.getByRole("heading", { name: title })).toBeVisible()
    await expect(page.getByText(CONTENT)).toBeVisible()
  })

  test("o ciornă nu ajunge pe website", async ({ page }) => {
    const slug = unique("stire-ascunsa")
    const title = `Ciornă invizibilă ${slug}`

    await createNews(page, { slug, title })

    await page.goto("/stiri")
    await expect(page.getByRole("heading", { name: title })).toBeHidden()

    const response = await page.goto(`/stiri/${slug}`)
    expect(response?.status()).toBe(404)
  })

  test("ciorna semănată rămâne invizibilă public", async ({ page }) => {
    const response = await page.goto(`/stiri/${SEED.draftNews.slug}`)
    expect(response?.status()).toBe(404)
  })

  test("un slug deja folosit este respins", async ({ page }) => {
    const slug = unique("stire-duplicat")

    await createNews(page, { slug, title: `Prima știre ${slug}` })

    await page.goto("/admin/stiri/nou")
    await fillNewsForm(page, { slug, title: `A doua știre ${slug}` })
    await page.getByRole("button", { name: "Creează știrea" }).click()

    await expect(page.getByRole("alert").filter({ hasText: "slug" })).toBeVisible()
    await expect(page).toHaveURL(/\/admin\/stiri\/nou/)
  })

  test("titlul prea scurt este validat înainte de trimitere", async ({
    page,
  }) => {
    await page.goto("/admin/stiri/nou")
    await fillNewsForm(page, { slug: unique("prea-scurt"), title: "ab" })
    await page.getByRole("button", { name: "Creează știrea" }).click()

    await expect(page).toHaveURL(/\/admin\/stiri\/nou/)
    await expect(page.locator("#title-error")).toBeVisible()
  })

  test("filtrul de stare restrânge lista", async ({ page }) => {
    const draftSlug = unique("filtru-ciorna")
    const draftTitle = `Ciornă filtrată ${draftSlug}`

    await createNews(page, { slug: draftSlug, title: draftTitle })

    await chooseOption(page.getByLabel("Filtrează după stare"), "Publicate")
    await expect(rowWith(page, draftTitle)).toBeHidden()

    await chooseOption(page.getByLabel("Filtrează după stare"), "Ciorne")
    await expect(rowWith(page, draftTitle)).toBeVisible()
  })

  test("căutarea găsește articolul după titlu", async ({ page }) => {
    const slug = unique("cautare")
    const title = `Articol căutabil ${slug}`

    await createNews(page, { slug, title })

    await page.getByLabel("Caută în știri").fill(slug)
    await expect(rowWith(page, title)).toBeVisible()
    await expect(rowWith(page, SEED.publishedNews.title)).toBeHidden()
  })

  test("ștergerea scoate articolul din listă și de pe website", async ({
    page,
  }) => {
    const slug = unique("stire-stearsa")
    const title = `De șters ${slug}`

    await createNews(page, { slug, title, status: "Publicat" })
    await expect(page.goto(`/stiri/${slug}`)).resolves.toBeTruthy()

    await page.goto("/admin/stiri")
    await rowWith(page, title).getByRole("button", { name: "Șterge" }).click()
    await confirmDialog(page, "Șterge")

    await expect(rowWith(page, title)).toBeHidden()

    const response = await page.goto(`/stiri/${slug}`)
    expect(response?.status()).toBe(404)
  })
})
