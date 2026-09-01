import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  listAll,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage"
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest"

/**
 * Verifică regulile Cloud Storage pe emulator.
 *
 * Modelul este mai strict decât la Firestore: clientul SDK nu poate citi sau
 * scrie nimic. Fotografiile sesizărilor se încarcă exclusiv prin Admin SDK și
 * se citesc prin URL semnat. Coperțile de conținut sunt publice prin ACL GCS,
 * nu prin regulile Firebase; SDK-ul din browser rămâne totuși refuzat.
 *
 * Pornire prealabilă: npm run emulators
 */
let testEnv: RulesTestEnvironment

/** Aceeași convenție ca în `uploadReportPhoto`: reports/<id>/<uuid>.<ext>. */
const PHOTO_PATH = "reports/report-1/6f1c2b9e-0000-4000-8000-000000000000.png"

/** Conținutul nu contează pentru reguli, doar existența obiectului. */
const BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47])

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "pntmm-rules-test",
    storage: {
      host: "127.0.0.1",
      port: 9199,
      rules: readFileSync(resolve(__dirname, "../../storage.rules"), "utf8"),
    },
  })
})

afterAll(async () => {
  await testEnv?.cleanup()
})

beforeEach(async () => {
  await testEnv.clearStorage()

  // Fișierul se scrie ocolind regulile, exact ca la încărcarea prin Admin SDK.
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await uploadBytes(ref(context.storage(), PHOTO_PATH), BYTES, {
      contentType: "image/png",
    })
  })
})

describe("fotografia unei sesizări", () => {
  it("există în bucket, deci refuzurile de mai jos vin din reguli", async () => {
    // Fără această verificare, un `assertFails` ar putea trece pentru că
    // fișierul lipsește, nu pentru că regula îl protejează.
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await assertSucceeds(getMetadata(ref(context.storage(), PHOTO_PATH)))
    })
  })

  it("nu poate fi descărcată de un vizitator neautentificat", async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(getDownloadURL(ref(storage, PHOTO_PATH)))
  })

  it("nu își dezvăluie metadatele unui vizitator neautentificat", async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(getMetadata(ref(storage, PHOTO_PATH)))
  })

  it("nu poate fi descărcată de un cont autentificat obișnuit", async () => {
    const storage = testEnv.authenticatedContext("membru").storage()
    await assertFails(getDownloadURL(ref(storage, PHOTO_PATH)))
  })

  it("nu poate fi descărcată nici de un cont cu claim de administrator", async () => {
    // Panoul folosește URL-uri semnate generate server-side, nu SDK-ul din
    // browser, deci regula rămâne închisă și pentru administratori.
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(getDownloadURL(ref(storage, PHOTO_PATH)))
  })
})

describe("scrierea din client", () => {
  it("refuză încărcarea unei fotografii de către un vizitator", async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(
      uploadBytes(ref(storage, "reports/report-2/incarcare.png"), BYTES),
    )
  })

  it("refuză încărcarea și pentru un cont autentificat", async () => {
    const storage = testEnv.authenticatedContext("membru").storage()
    await assertFails(
      uploadBytes(ref(storage, "reports/report-2/incarcare.png"), BYTES),
    )
  })

  it("refuză încărcarea și pentru un cont cu claim de administrator", async () => {
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(
      uploadBytes(ref(storage, "reports/report-2/incarcare.png"), BYTES),
    )
  })

  it("refuză suprascrierea unei fotografii existente", async () => {
    const storage = testEnv.authenticatedContext("membru").storage()
    await assertFails(uploadBytes(ref(storage, PHOTO_PATH), BYTES))
  })

  it("refuză modificarea metadatelor", async () => {
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(
      updateMetadata(ref(storage, PHOTO_PATH), {
        cacheControl: "public, max-age=31536000",
      }),
    )
  })

  it("refuză ștergerea unei fotografii", async () => {
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(deleteObject(ref(storage, PHOTO_PATH)))
  })
})

describe("restul bucket-ului", () => {
  it("nu permite listarea folderului cu sesizări", async () => {
    const storage = testEnv.unauthenticatedContext().storage()
    await assertFails(listAll(ref(storage, "reports")))
  })

  it("nu permite listarea rădăcinii bucket-ului", async () => {
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(listAll(ref(storage, "/")))
  })

  it("nu există folder public din care să se citească fără autentificare", async () => {
    const storage = testEnv.unauthenticatedContext().storage()

    await assertFails(getDownloadURL(ref(storage, "public/logo.png")))
    await assertFails(uploadBytes(ref(storage, "public/logo.png"), BYTES))
  })

  it("nu permite scrierea în afara folderului de sesizări", async () => {
    const storage = testEnv.authenticatedContext("membru").storage()
    await assertFails(uploadBytes(ref(storage, "oriunde/fisier.png"), BYTES))
  })

  it("refuză încărcarea unei coperți de știre din client", async () => {
    const storage = testEnv
      .authenticatedContext("administrator", { role: "admin" })
      .storage()

    await assertFails(
      uploadBytes(ref(storage, "content/news/item-1/cover.webp"), BYTES),
    )
  })
})
