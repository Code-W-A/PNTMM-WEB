#!/usr/bin/env node
/**
 * Atribuie sau retrage claim-ul de administrator unui cont Firebase existent.
 *
 * Utilizare:
 *   node --env-file=.env.local scripts/grant-admin.mjs <email|uid>
 *   node --env-file=.env.local scripts/grant-admin.mjs <email|uid> --revoke
 *
 * Contul trebuie să existe deja în Firebase Authentication. Scriptul nu creează
 * utilizatori și nu setează parole. Credențialele sunt citite exclusiv din
 * environment, niciodată din cod.
 */

import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const [, , identifier, ...flags] = process.argv
const revoke = flags.includes("--revoke")

if (!identifier) {
  console.error(
    "Utilizare: node --env-file=.env.local scripts/grant-admin.mjs <email|uid> [--revoke]",
  )
  process.exit(1)
}

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!projectId || !clientEmail || !privateKey) {
  console.error(
    "Lipsesc FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL sau FIREBASE_PRIVATE_KEY.",
  )
  process.exit(1)
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })

const auth = getAuth()

try {
  const user = identifier.includes("@")
    ? await auth.getUserByEmail(identifier)
    : await auth.getUser(identifier)

  const existingClaims = user.customClaims ?? {}
  const nextClaims = { ...existingClaims }

  if (revoke) {
    delete nextClaims.role
    delete nextClaims.admin
  } else {
    nextClaims.role = "admin"
  }

  await auth.setCustomUserClaims(user.uid, nextClaims)
  // Forțează reautentificarea, ca noile drepturi să intre imediat în vigoare.
  await auth.revokeRefreshTokens(user.uid)

  console.log(
    revoke
      ? `Drepturile de administrator au fost retrase pentru ${user.email ?? user.uid}.`
      : `Drepturile de administrator au fost acordate pentru ${user.email ?? user.uid}.`,
  )
  console.log("Utilizatorul trebuie să se autentifice din nou.")
  process.exit(0)
} catch (error) {
  console.error("Operațiunea a eșuat:", error.message)
  process.exit(1)
}
