import { expect, test } from "@playwright/test"

import { SEED, USERS } from "../fixtures/e2e-config"
import { apiFetch, idTokenFor, onePixelPng, unique } from "../fixtures/helpers"

test.describe.serial("API-ul aplicației mobile", () => {
  let idToken: string
  let uid: string

  test.beforeAll(async () => {
    idToken = await idTokenFor(USERS.nonAdmin.email, USERS.nonAdmin.password)
  })

  test("bootstrap, știrile și evenimentele rămân publice", async ({
    request,
  }) => {
    const [bootstrap, news, events] = await Promise.all([
      request.get("/api/mobile/bootstrap"),
      request.get("/api/mobile/news"),
      request.get("/api/mobile/events"),
    ])

    expect(bootstrap.status()).toBe(200)
    expect((await bootstrap.json()).site.name).toBe("PNȚMM Cluj")

    expect(news.status()).toBe(200)
    const newsItems = (await news.json()).items
    expect(newsItems.some((item: { slug: string }) => item.slug === SEED.publishedNews.slug)).toBe(true)
    expect(newsItems.some((item: { slug: string }) => item.slug === SEED.draftNews.slug)).toBe(false)

    expect(events.status()).toBe(200)
    expect((await events.json()).items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ slug: SEED.upcomingEvent.slug }),
      ]),
    )
  })

  test("profilul cere Bearer token și permite actualizări parțiale", async ({
    request,
  }) => {
    expect((await request.get("/api/mobile/profile")).status()).toBe(401)

    const response = await request.patch("/api/mobile/profile", {
      headers: { Authorization: `Bearer ${idToken}` },
      data: { phone: "+40 700 123 456" },
    })

    expect(response.status()).toBe(200)
    const profile = (await response.json()).profile
    uid = profile.uid
    expect(profile.email).toBe(USERS.nonAdmin.email)
    expect(profile.phone).toBe("+40 700 123 456")
  })

  test("înscrierea autentificată este idempotentă și apare în export cu UID", async ({
    page,
    request,
  }) => {
    const payload = {
      eventId: SEED.upcomingEvent.id,
      name: USERS.nonAdmin.displayName,
      email: USERS.nonAdmin.email,
      privacyAccepted: true,
    }
    const headers = { Authorization: `Bearer ${idToken}` }
    const first = await request.post("/api/forms/event-registration", {
      headers,
      data: payload,
    })
    const second = await request.post("/api/forms/event-registration", {
      headers,
      data: payload,
    })

    expect(first.status()).toBe(201)
    expect((await first.json()).alreadyRegistered).toBe(false)
    expect(second.status()).toBe(200)
    expect((await second.json()).alreadyRegistered).toBe(true)

    const state = await request.get(
      `/api/mobile/event-registrations/${SEED.upcomingEvent.id}`,
      { headers },
    )
    expect((await state.json()).registered).toBe(true)

    await page.goto("/admin")
    const csv = await apiFetch(
      page,
      `/api/admin/export/participanti?eventId=${SEED.upcomingEvent.id}`,
    )
    expect(csv.status).toBe(200)
    expect(csv.body).toContain(uid)
    expect(csv.body).toContain("Aplicație mobilă")
  })

  test("formularele private păstrează identitatea mobilă", async ({
    request,
  }) => {
    const headers = { Authorization: `Bearer ${idToken}` }
    const suffix = unique("mobile")

    const report = await request.post("/api/forms/report", {
      headers,
      multipart: {
        name: USERS.nonAdmin.displayName,
        email: USERS.nonAdmin.email,
        subject: `Sesizare ${suffix}`,
        description:
          "Descriere suficient de detaliată pentru sesizarea trimisă din aplicația mobilă.",
        privacyAccepted: "true",
        photo: {
          name: "sesizare.png",
          mimeType: "image/png",
          buffer: onePixelPng(),
        },
      },
    })
    const proposal = await request.post("/api/forms/proposal", {
      headers,
      data: {
        name: USERS.nonAdmin.displayName,
        email: USERS.nonAdmin.email,
        title: `Propunere ${suffix}`,
        description:
          "Descriere suficient de detaliată pentru propunerea privată trimisă din aplicație.",
        privacyAccepted: true,
      },
    })
    const deletion = await request.post("/api/forms/deletion-request", {
      headers,
      data: {
        email: USERS.nonAdmin.email,
        message: "Cerere E2E din aplicația mobilă.",
        privacyAccepted: true,
      },
    })

    expect(report.status()).toBe(201)
    expect(proposal.status()).toBe(201)
    expect(deletion.status()).toBe(201)
  })

  test("preferința oprită împiedică activarea tokenului push", async ({
    request,
  }) => {
    const headers = { Authorization: `Bearer ${idToken}` }
    await request.patch("/api/mobile/profile", {
      headers,
      data: { notificationPreferences: { general: false } },
    })

    const token = `ExponentPushToken[${unique("device-token")}]`
    const disabled = await request.post("/api/push-tokens", {
      headers,
      data: {
        token,
        provider: "expo",
        platform: "ios",
        installationId: "mobile-e2e-installation",
        enabled: true,
      },
    })
    expect(disabled.status()).toBe(201)
    expect((await disabled.json()).enabled).toBe(false)

    await request.patch("/api/mobile/profile", {
      headers,
      data: { notificationPreferences: { general: true } },
    })
    const enabled = await request.post("/api/push-tokens", {
      headers,
      data: {
        token,
        provider: "expo",
        platform: "ios",
        installationId: "mobile-e2e-installation",
        enabled: true,
      },
    })
    expect(enabled.status()).toBe(200)
    expect((await enabled.json()).enabled).toBe(true)
  })
})
