#!/usr/bin/env node
/**
 * Verifică rapid că backendul este configurat corect: inițializează Admin SDK
 * din environment și numără documentele din colecțiile publice.
 *
 * Utilizare: node --env-file=.env.local scripts/check-backend.mjs
 */
import { cert, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

if (!projectId || !clientEmail || !privateKey) {
  console.error("Lipsesc credențialele Admin SDK din environment.")
  process.exit(1)
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })

const db = getFirestore()

try {
  const collections = await db.listCollections()

  console.log(`Proiect: ${projectId}`)
  console.log(`Conexiune Firestore: reușită`)
  console.log(
    collections.length === 0
      ? "Colecții existente: niciuna (baza este goală)"
      : `Colecții existente: ${collections.map((c) => c.id).join(", ")}`,
  )
  process.exit(0)
} catch (error) {
  console.error("Conexiunea a eșuat:", error.message)
  process.exit(1)
}
