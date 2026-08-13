import { expect, test } from "@playwright/test"

import { SEED, USERS } from "../fixtures/e2e-config"
import { apiFetch, idTokenFor } from "../fixtures/helpers"

/** Endpoint-urile administrative, cu metoda și un payload minim valid. */
const ADMIN_ENDPOINTS = [
  { method: "GET", path: "/api/admin/news" },
  { method: "POST", path: "/api/admin/news", data: {} },
  { method: "PATCH", path: "/api/admin/news/oarecare", data: {} },
  { method: "DELETE", path: "/api/admin/news/oarecare" },
  { method: "GET", path: "/api/admin/events" },
  { method: "POST", path: "/api/admin/events", data: {} },
  { method: "PATCH", path: "/api/admin/events/oarecare", data: {} },
  { method: "DELETE", path: "/api/admin/events/oarecare" },
  { method: "GET", path: "/api/admin/users" },
  { method: "PATCH", path: "/api/admin/users/oarecare", data: {} },
  { method: "POST", path: "/api/admin/notifications", data: {} },
  { method: "PATCH", path: "/api/admin/submissions/reports/oarecare", data: {} },
  { method: "GET", path: "/api/admin/export/utilizatori" },
  { method: "GET", path: "/api/admin/export/sesizari" },
  { method: "GET", path: "/api/admin/export/propuneri" },
  { method: "GET", path: "/api/admin/export/participanti" },
] as const

test.describe("Securitatea API-ului fără sesiune", () => {
  // Fără storageState: cererile pleacă fără cookie de administrare.
  test.use({ storageState: { cookies: [], origins: [] } })

  for (const endpoint of ADMIN_ENDPOINTS) {
    test(`${endpoint.method} ${endpoint.path} răspunde 401`, async ({
      request,
    }) => {
      const response = await request.fetch(endpoint.path, {
        method: endpoint.method,
        ...("data" in endpoint && endpoint.data
          ? { data: endpoint.data }
          : {}),
      })

      expect(response.status()).toBe(401)
    })
  }

  test("un token fără claim de administrare primește 403 la creare de sesiune", async ({
    request,
  }) => {
    const idToken = await idTokenFor(
      USERS.nonAdmin.email,
      USERS.nonAdmin.password,
    )

    const response = await request.post("/api/auth/session", {
      data: { idToken },
    })

    expect(response.status()).toBe(403)
    const body = await response.json()
    expect(body.error.message).toContain("drepturi de administrare")
  })

  test("un token invalid este respins la creare de sesiune", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/session", {
      data: { idToken: "token-inventat" },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
    expect(response.status()).toBeLessThan(500)
  })

  test("paginile publice rămân accesibile fără autentificare", async ({
    request,
  }) => {
    for (const path of ["/", "/stiri", "/evenimente", "/contact"]) {
      const response = await request.get(path)
      expect(response.status(), `pagina ${path}`).toBe(200)
    }
  })
})

test.describe("Securitatea API-ului cu sesiune de administrare", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin")
  })

  test("exportul participanților fără eventId răspunde 400", async ({
    page,
  }) => {
    const response = await apiFetch(page, "/api/admin/export/participanti")

    expect(response.status).toBe(400)
    expect(JSON.parse(response.body).error.code).toBe("missing_event")
  })

  test("exportul participanților cu eventId răspunde CSV", async ({ page }) => {
    const response = await apiFetch(
      page,
      `/api/admin/export/participanti?eventId=${SEED.upcomingEvent.id}`,
    )

    expect(response.status).toBe(200)
    expect(response.contentType).toContain("text/csv")
    expect(response.body).toContain(SEED.registrations[0].email)
  })

  test("un set de date inexistent răspunde 404", async ({ page }) => {
    const response = await apiFetch(page, "/api/admin/export/inexistent")

    expect(response.status).toBe(404)
  })

  test("payloadul invalid este respins cu 400", async ({ page }) => {
    const response = await apiFetch(page, "/api/admin/news", {
      method: "POST",
      body: { title: "ab" },
    })

    expect(response.status).toBe(400)
  })

  test("o entitate inexistentă răspunde 404, nu 500", async ({ page }) => {
    const response = await apiFetch(page, "/api/admin/news/inexistent", {
      method: "DELETE",
    })

    expect(response.status).toBe(404)
  })
})

test.describe("Validarea formularelor publice pe server", () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test("mesajul de contact incomplet este respins", async ({ request }) => {
    const response = await request.post("/api/forms/contact", {
      data: { name: "A", email: "nu-e-email", subject: "", message: "" },
    })

    expect(response.status()).toBe(400)
  })

  test("propunerea incompletă este respinsă", async ({ request }) => {
    const response = await request.post("/api/forms/proposal", {
      data: { name: "A", email: "a@b.test", title: "x", description: "y" },
    })

    expect(response.status()).toBe(400)
  })

  test("înscrierea la un eveniment inexistent este respinsă", async ({
    request,
  }) => {
    const response = await request.post("/api/forms/event-registration", {
      data: {
        eventId: "eveniment-inexistent",
        name: "Test Participant",
        email: "test@exemplu.test",
        privacyAccepted: true,
      },
    })

    expect(response.status()).toBeGreaterThanOrEqual(400)
  })

  test("un formular valid este acceptat și marchează regimul de date", async ({
    request,
  }) => {
    const response = await request.post("/api/forms/contact", {
      data: {
        name: "Vizitator API",
        email: "api@exemplu.test",
        subject: "Verificare prin API",
        message:
          "Mesaj trimis direct către endpoint pentru a verifica validarea pe server.",
        privacyAccepted: true,
      },
    })

    expect(response.status()).toBe(201)
    const body = await response.json()
    // Poarta REAL_DATA_COLLECTION_ENABLED este închisă în mediul de test.
    expect(body.dataMode).toBe("test")
  })
})
