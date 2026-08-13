/**
 * Sursa unică a mediului E2E, folosită de orchestrator, de seed, de configul
 * Playwright și de specuri.
 *
 * Este scris în CommonJS pentru că trebuie citit identic din scripturi ESM și
 * din configul TypeScript al Playwright.
 *
 * Proiectul are prefixul `demo-`, convenția prin care SDK-urile Firebase refuză
 * să contacteze producția. Împreună cu hosturile de emulator și cu verificarea
 * din `assertEmulatorEnv`, asta garantează că testele nu pot atinge
 * `pntmm-cluj-web`.
 */

const E2E_PROJECT_ID = "demo-pntmm-e2e"

const E2E_PORT = 3100
const E2E_BASE_URL = `http://127.0.0.1:${E2E_PORT}`

const FIRESTORE_HOST = "127.0.0.1:8080"
const AUTH_HOST = "127.0.0.1:9099"
const STORAGE_HOST = "127.0.0.1:9199"

/** Emulatorul Auth acceptă orice cheie API; nu este un secret. */
const E2E_API_KEY = "demo-e2e-api-key"

const E2E_USERS = {
  admin: {
    email: "admin.e2e@pntmm.test",
    password: "Parola-E2E-1234",
    displayName: "Administrator E2E",
    admin: true,
  },
  /**
   * Al doilea administrator există pentru testele de login și deconectare.
   * Deconectarea revocă token-urile contului, iar `verifySessionCookie` verifică
   * revocarea, deci folosirea contului principal ar invalida `storageState`-ul
   * partajat de restul suitei.
   */
  sessionAdmin: {
    email: "sesiune.e2e@pntmm.test",
    password: "Parola-E2E-1234",
    displayName: "Administrator sesiune",
    admin: true,
  },
  nonAdmin: {
    email: "fara-drepturi.e2e@pntmm.test",
    password: "Parola-E2E-1234",
    displayName: "Cont fără drepturi",
    admin: false,
  },
  toDisable: {
    email: "de-dezactivat.e2e@pntmm.test",
    password: "Parola-E2E-1234",
    displayName: "Membru de dezactivat",
    admin: false,
  },
  disabled: {
    email: "deja-dezactivat.e2e@pntmm.test",
    password: "Parola-E2E-1234",
    displayName: "Membru dezactivat",
    admin: false,
    disabled: true,
  },
}

/**
 * `@next/env` nu suprascrie variabilele deja prezente în `process.env`, deci
 * aceste valori au prioritate față de `.env.local`, care conține credențialele
 * proiectului real.
 */
function e2eEnv() {
  return {
    PORT: String(E2E_PORT),
    NEXT_DIST_DIR: ".next-e2e",

    FIREBASE_PROJECT_ID: E2E_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: E2E_PROJECT_ID,
    GCLOUD_PROJECT: E2E_PROJECT_ID,

    FIRESTORE_EMULATOR_HOST: FIRESTORE_HOST,
    FIREBASE_AUTH_EMULATOR_HOST: AUTH_HOST,
    FIREBASE_STORAGE_EMULATOR_HOST: STORAGE_HOST,
    NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST: AUTH_HOST,

    // Credențialele reale nu trebuie să ajungă niciodată în procesul de test.
    FIREBASE_CLIENT_EMAIL: "",
    FIREBASE_PRIVATE_KEY: "",
    FIREBASE_STORAGE_BUCKET: `${E2E_PROJECT_ID}.appspot.com`,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${E2E_PROJECT_ID}.appspot.com`,

    NEXT_PUBLIC_FIREBASE_API_KEY: E2E_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${E2E_PROJECT_ID}.firebaseapp.com`,
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:000000000000:web:e2e",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "000000000000",

    // Gol înseamnă client App Check dezactivat; altfel testele ar aștepta reCAPTCHA.
    NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY: "",
    APPCHECK_MODE: "off",

    NEXT_PUBLIC_SITE_URL: E2E_BASE_URL,
    NEXT_PUBLIC_FORMS_ENABLED: "true",
    REAL_DATA_COLLECTION_ENABLED: "false",
  }
}

/** Mediul curent al procesului, cu valorile E2E suprascrise. */
function withE2eEnv(extra = {}) {
  return { ...process.env, ...e2eEnv(), ...extra }
}

/**
 * Ultima barieră înainte de orice scriere. Refuză să continue dacă mediul nu
 * este cel al emulatorilor, ca un `.env.local` încărcat din greșeală să nu
 * poată trimite datele de test în proiectul real.
 */
function assertEmulatorEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID

  if (!projectId || !projectId.startsWith("demo-")) {
    throw new Error(
      `Refuz să rulez: FIREBASE_PROJECT_ID este "${projectId || "nedefinit"}", ` +
        "iar testele E2E acceptă doar proiecte cu prefixul demo-.",
    )
  }

  for (const variable of [
    "FIRESTORE_EMULATOR_HOST",
    "FIREBASE_AUTH_EMULATOR_HOST",
  ]) {
    if (!process.env[variable]) {
      throw new Error(`Refuz să rulez: ${variable} nu este setat.`)
    }
  }
}

module.exports = {
  E2E_PROJECT_ID,
  E2E_PORT,
  E2E_BASE_URL,
  FIRESTORE_HOST,
  AUTH_HOST,
  STORAGE_HOST,
  E2E_API_KEY,
  E2E_USERS,
  e2eEnv,
  withE2eEnv,
  assertEmulatorEnv,
}
