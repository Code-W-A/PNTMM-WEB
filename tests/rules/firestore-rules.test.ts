import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

/**
 * Verifică regulile Firestore pe emulator.
 *
 * Modelul este: clientul citește doar conținutul publicat, nu scrie nimic,
 * iar datele personale sunt complet inaccesibile din browser. Toate scrierile
 * reale trec prin API-ul server-side cu Admin SDK, care ocolește regulile.
 *
 * Pornire prealabilă: npm run emulators
 */
let testEnv: RulesTestEnvironment

const PRIVATE_COLLECTIONS = [
  "reports",
  "proposals",
  "contactMessages",
  "interestSubmissions",
  "eventRegistrations",
  "deletionRequests",
  "users",
  "pushTokens",
  "notifications",
  "adminActions",
]

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "pntmm-rules-test",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: readFileSync(resolve(__dirname, "../../firestore.rules"), "utf8"),
    },
  })
})

afterAll(async () => {
  await testEnv?.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()

  // Datele de pornire se scriu ocolind regulile, ca la scrierea prin Admin SDK.
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()

    await setDoc(doc(db, "news/published-1"), {
      slug: "comunicat",
      title: "Comunicat",
      status: "published",
    })
    await setDoc(doc(db, "news/draft-1"), {
      slug: "ciorna",
      title: "Ciornă",
      status: "draft",
    })
    await setDoc(doc(db, "events/published-1"), {
      slug: "intalnire",
      title: "Întâlnire",
      status: "published",
    })
    await setDoc(doc(db, "events/draft-1"), {
      slug: "eveniment-ciorna",
      title: "Ciornă",
      status: "draft",
    })
    await setDoc(doc(db, "siteContent/home"), { fields: { heroTitle: "Acasă" } })

    for (const collection of PRIVATE_COLLECTIONS) {
      await setDoc(doc(db, `${collection}/doc-1`), { email: "ion@exemplu.ro" })
    }
  })
})

describe("conținut public", () => {
  it("permite citirea unei știri publicate", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertSucceeds(getDoc(doc(db, "news/published-1")))
  })

  it("refuză citirea unei știri în ciornă", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(db, "news/draft-1")))
  })

  it("permite citirea unui eveniment publicat", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertSucceeds(getDoc(doc(db, "events/published-1")))
  })

  it("refuză citirea unui eveniment în ciornă", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertFails(getDoc(doc(db, "events/draft-1")))
  })

  it("permite citirea conținutului administrat al site-ului", async () => {
    const db = testEnv.unauthenticatedContext().firestore()
    await assertSucceeds(getDoc(doc(db, "siteContent/home")))
  })

  it("refuză scrierea în conținutul public", async () => {
    const db = testEnv.unauthenticatedContext().firestore()

    await assertFails(
      setDoc(doc(db, "news/published-1"), { title: "Modificat" }),
    )
    await assertFails(setDoc(doc(db, "events/nou"), { status: "published" }))
    await assertFails(setDoc(doc(db, "siteContent/home"), { fields: {} }))
  })
})

describe("date private", () => {
  for (const collection of PRIVATE_COLLECTIONS) {
    it(`refuză citirea publică din ${collection}`, async () => {
      const db = testEnv.unauthenticatedContext().firestore()
      await assertFails(getDoc(doc(db, `${collection}/doc-1`)))
    })

    it(`refuză scrierea directă din client în ${collection}`, async () => {
      const db = testEnv.unauthenticatedContext().firestore()
      await assertFails(
        setDoc(doc(db, `${collection}/doc-nou`), { email: "x@exemplu.ro" }),
      )
    })
  }

  it("refuză accesul și pentru un utilizator autentificat", async () => {
    const db = testEnv.authenticatedContext("uid-1").firestore()

    await assertFails(getDoc(doc(db, "reports/doc-1")))
    await assertFails(getDoc(doc(db, "users/doc-1")))
  })

  it("refuză accesul chiar și cu un claim de administrator în client", async () => {
    // Drepturile de administrare se verifică server-side; un token cu claim
    // nu deschide accesul direct la Firestore din browser.
    const db = testEnv
      .authenticatedContext("uid-admin", { role: "admin" })
      .firestore()

    await assertFails(getDoc(doc(db, "reports/doc-1")))
    await assertFails(getDoc(doc(db, "contactMessages/doc-1")))
  })
})

describe("căi neprevăzute", () => {
  it("refuză implicit orice colecție nedeclarată", async () => {
    const db = testEnv.unauthenticatedContext().firestore()

    await assertFails(getDoc(doc(db, "colectieNecunoscuta/doc-1")))
    expect(true).toBe(true)
  })
})
