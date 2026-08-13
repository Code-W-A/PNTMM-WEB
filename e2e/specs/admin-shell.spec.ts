import { expect, test, type Page } from "@playwright/test"

/** Învelișul care poartă starea sidebarului pe desktop. */
function sidebarShell(page: Page) {
  return page.locator('div.peer[data-side="left"]')
}

/** Panoul vizibil al sidebarului, cel care ocupă efectiv spațiu pe ecran. */
function sidebarPanel(page: Page) {
  return page.locator('[data-sidebar="sidebar"]').first()
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
})

test.describe("Structura panoului pe desktop", () => {
  test("conținutul nu este acoperit de sidebar", async ({ page }) => {
    // Regresie pentru bugul în care sintaxa greșită a variabilelor Tailwind 4
    // lăsa conținutul sub sidebar.
    await page.goto("/admin")

    const panel = sidebarPanel(page)
    const heading = page.getByRole("heading", {
      name: "Panou de administrare",
      exact: true,
    })

    const panelBox = await panel.boundingBox()
    const headingBox = await heading.boundingBox()

    expect(panelBox).not.toBeNull()
    expect(headingBox).not.toBeNull()
    expect(panelBox!.width).toBeGreaterThan(150)
    expect(headingBox!.x).toBeGreaterThanOrEqual(panelBox!.x + panelBox!.width)
  })

  test("sidebarul se colapsează la iconuri și revine", async ({ page }) => {
    await page.goto("/admin")

    const shell = sidebarShell(page)
    const panel = sidebarPanel(page)

    await expect(shell).toHaveAttribute("data-state", "expanded")
    const expandedWidth = (await panel.boundingBox())!.width

    await page.getByRole("button", { name: "Comută navigarea" }).click()
    await expect(shell).toHaveAttribute("data-state", "collapsed")
    await expect(shell).toHaveAttribute("data-collapsible", "icon")

    // Lățimea se animează, deci așteptăm încheierea tranziției în loc să
    // măsurăm o valoare intermediară.
    await expect
      .poll(async () => (await panel.boundingBox())!.width)
      .toBeLessThan(100)

    const collapsedWidth = (await panel.boundingBox())!.width
    expect(collapsedWidth).toBeLessThan(expandedWidth)
    // Colapsat înseamnă doar iconuri: o bandă îngustă, dar tot vizibilă.
    expect(collapsedWidth).toBeGreaterThan(0)

    // Conținutul rămâne în dreapta și după colapsare.
    const headingBox = (await page
      .getByRole("heading", { name: "Panou de administrare", exact: true })
      .boundingBox())!
    const panelBox = (await panel.boundingBox())!
    expect(headingBox.x).toBeGreaterThanOrEqual(panelBox.x + panelBox.width)

    await page.getByRole("button", { name: "Comută navigarea" }).click()
    await expect(shell).toHaveAttribute("data-state", "expanded")
  })

  test("iconurile din sidebarul colapsat păstrează etichete accesibile", async ({
    page,
  }) => {
    await page.goto("/admin")
    await page.getByRole("button", { name: "Comută navigarea" }).click()

    const panel = sidebarPanel(page)
    await expect(panel.getByRole("link", { name: "Știri" })).toHaveCount(1)
    await expect(panel.getByRole("button", { name: "Deconectare" })).toHaveCount(
      1,
    )
  })

  test("navigarea din sidebar schimbă secțiunea și marchează activul", async ({
    page,
  }) => {
    await page.goto("/admin")

    const panel = sidebarPanel(page)
    await panel.getByRole("link", { name: "Știri" }).click()

    await expect(page).toHaveURL(/\/admin\/stiri$/)
    await expect(panel.getByRole("link", { name: "Știri" })).toHaveAttribute(
      "data-active",
      "true",
    )
  })

  test("pagina are un singur landmark principal", async ({ page }) => {
    await page.goto("/admin")

    await expect(page.locator("main")).toHaveCount(1)
  })

  test("primul Tab ajunge pe un element focalizabil vizibil", async ({
    page,
  }) => {
    await page.goto("/admin")
    await page.keyboard.press("Tab")

    const focused = page.locator(":focus")
    await expect(focused).toHaveCount(1)
    await expect(focused).toBeVisible()
  })

  test("fiecare secțiune a panoului se încarcă fără erori", async ({ page }) => {
    const routes = [
      ["/admin/stiri", "Știri"],
      ["/admin/evenimente", "Evenimente"],
      ["/admin/sesizari", "Sesizări"],
      ["/admin/propuneri", "Propuneri"],
      ["/admin/formulare", "Formulare website"],
      ["/admin/utilizatori", "Utilizatori"],
      ["/admin/notificari", "Notificări"],
    ] as const

    for (const [route, heading] of routes) {
      const response = await page.goto(route)
      expect(response?.status(), `ruta ${route}`).toBe(200)
      await expect(
        page.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible()
    }
  })

  test("modulul de conținut website a fost eliminat", async ({ page }) => {
    await page.goto("/admin")

    await expect(
      sidebarPanel(page).getByRole("link", { name: "Conținut website" }),
    ).toHaveCount(0)

    const response = await page.goto("/admin/continut")
    expect(response?.status()).toBe(404)
  })

  test("linkul către website este disponibil din sidebar", async ({ page }) => {
    await page.goto("/admin")

    await expect(
      sidebarPanel(page).getByRole("link", { name: "Vezi website-ul" }),
    ).toHaveAttribute("href", "/")
  })
})
