#!/usr/bin/env node
/**
 * Scrie credențialele Admin SDK dintr-un fișier de cheie service account în
 * .env.local, apoi șterge fișierul de cheie.
 *
 * Utilizare: node scripts/apply-service-account.mjs <cale-cheie.json>
 *
 * Cheia privată nu este afișată niciodată în terminal.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const keyPath = process.argv[2]

if (!keyPath) {
  console.error("Utilizare: node scripts/apply-service-account.mjs <cale.json>")
  process.exit(1)
}

const key = JSON.parse(readFileSync(keyPath, "utf8"))
const envPath = resolve(process.cwd(), ".env.local")
let env = readFileSync(envPath, "utf8")

const escapedPrivateKey = key.private_key.replace(/\n/g, "\\n")

function setVar(name, value) {
  const line = `${name}=${value}`
  const pattern = new RegExp(`^${name}=.*$`, "m")

  env = pattern.test(env) ? env.replace(pattern, line) : `${env}\n${line}\n`
}

setVar("FIREBASE_PROJECT_ID", key.project_id)
setVar("FIREBASE_CLIENT_EMAIL", key.client_email)
setVar("FIREBASE_PRIVATE_KEY", `"${escapedPrivateKey}"`)

writeFileSync(envPath, env, { mode: 0o600 })
rmSync(keyPath, { force: true })

console.log(`Credențiale scrise în .env.local pentru ${key.client_email}.`)
console.log(`Fișierul de cheie ${keyPath} a fost șters.`)
