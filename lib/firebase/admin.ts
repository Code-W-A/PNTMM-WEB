import "server-only"

import { cert, getApps, initializeApp, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"
import { getFirestore, type Firestore } from "firebase-admin/firestore"
import { getMessaging, type Messaging } from "firebase-admin/messaging"
import { getStorage } from "firebase-admin/storage"

const ADMIN_APP_NAME = "pntmm-admin"

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

/** Cheia privată ajunge din environment cu `\n` escapat. */
function readPrivateKey(): string | undefined {
  const raw = process.env.FIREBASE_PRIVATE_KEY
  if (!raw) return undefined
  return raw.includes("\\n") ? raw.replace(/\\n/g, "\n") : raw
}

/** Emulatorii nu necesită service account, doar un projectId. */
function usingEmulators(): boolean {
  return Boolean(
    process.env.FIRESTORE_EMULATOR_HOST ||
      process.env.FIREBASE_AUTH_EMULATOR_HOST,
  )
}

export function isFirebaseAdminConfigured(): boolean {
  if (!projectId) return false
  if (usingEmulators()) return true
  return Boolean(clientEmail && readPrivateKey())
}

let cachedApp: App | null = null

export function getAdminApp(): App {
  if (cachedApp) return cachedApp

  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      "Firebase Admin nu este configurat. Verificați variabilele de mediu server.",
    )
  }

  const existing = getApps().find((app) => app.name === ADMIN_APP_NAME)
  if (existing) {
    cachedApp = existing
    return existing
  }

  const privateKey = readPrivateKey()

  cachedApp = initializeApp(
    {
      projectId,
      storageBucket,
      ...(usingEmulators() || !privateKey || !clientEmail
        ? {}
        : {
            credential: cert({
              projectId,
              clientEmail,
              privateKey,
            }),
          }),
    },
    ADMIN_APP_NAME,
  )

  return cachedApp
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}

type AdminGlobals = typeof globalThis & {
  __pntmmAdminDb?: Firestore
}

let cachedDb: Firestore | null = null

/**
 * În Next.js, hot reload reincarcă modulul și golește `cachedDb`, dar instanța
 * Firestore de pe app rămâne deja inițializată. `settings()` poate fi apelat
 * o singură dată — de aceea păstrăm referința pe `globalThis` și ignorăm
 * eroarea dacă setările există deja.
 */
export function getAdminDb(): Firestore {
  if (cachedDb) return cachedDb

  const globals = globalThis as AdminGlobals
  if (globals.__pntmmAdminDb) {
    cachedDb = globals.__pntmmAdminDb
    return cachedDb
  }

  const db = getFirestore(getAdminApp())

  try {
    db.settings({ ignoreUndefinedProperties: true })
  } catch {
    // Firestore a fost deja configurat în acest proces (ex. după hot reload).
  }

  cachedDb = db
  globals.__pntmmAdminDb = db
  return cachedDb
}

export function getAdminBucket() {
  if (!storageBucket) {
    throw new Error("FIREBASE_STORAGE_BUCKET nu este configurat.")
  }

  return getStorage(getAdminApp()).bucket(storageBucket)
}

export function getAdminMessaging(): Messaging {
  return getMessaging(getAdminApp())
}
