/**
 * Orchestratorul suitei E2E.
 *
 * Ordinea contează: seed-ul trebuie să ruleze înainte de build, ca paginile
 * publice cu `revalidate` să fie preRandate cu datele semănate. Serverul Next
 * este pornit de Playwright însuși, prin `webServer`.
 */
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"

import e2eConfig from "./e2e-env.cjs"

const { AUTH_HOST, E2E_PROJECT_ID, FIRESTORE_HOST, STORAGE_HOST, withE2eEnv } =
  e2eConfig

const passthroughArgs = process.argv.slice(2)
const children = []

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: options.silent ? ["ignore", "pipe", "pipe"] : "inherit",
    env: options.env ?? withE2eEnv(),
    ...options.spawn,
  })

  children.push(child)

  return child
}

function runToCompletion(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = run(command, args, options)

    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(" ")} a ieșit cu codul ${code}`))
      }
    })
  })
}

async function waitForPort(hostPort, label, timeoutMs = 150_000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    try {
      // Orice răspuns HTTP înseamnă că portul ascultă; codul nu contează.
      await fetch(`http://${hostPort}/`)
      return
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  throw new Error(`${label} nu a pornit în ${timeoutMs / 1000} secunde.`)
}

function shutdown() {
  for (const child of children) {
    if (!child.killed) {
      try {
        child.kill("SIGTERM")
      } catch {
        // Procesul se închisese deja.
      }
    }
  }
}

process.on("SIGINT", () => {
  shutdown()
  process.exit(130)
})

process.on("SIGTERM", () => {
  shutdown()
  process.exit(143)
})

function javaHome() {
  // firebase-tools cere JDK 21 sau mai nou pentru emulatorul Firestore.
  const candidates = [
    process.env.JAVA_HOME,
    "/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
    "/usr/local/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home",
  ]

  return candidates.find((path) => path && existsSync(path))
}

async function main() {
  const home = javaHome()

  const emulatorEnv = withE2eEnv({
    ...(home ? { JAVA_HOME: home, PATH: `${home}/bin:${process.env.PATH}` } : {}),
    // Cache-ul implicit din ~/.cache nu este întotdeauna scriibil.
    FIREBASE_EMULATORS_PATH:
      process.env.FIREBASE_EMULATORS_PATH ??
      `${process.env.HOME}/.firebase-emulators`,
  })

  console.log("→ Pornesc emulatorii Firebase...")

  const emulators = run(
    "npx",
    [
      "--yes",
      "firebase-tools",
      "emulators:start",
      "--only",
      "auth,firestore,storage",
      "--project",
      E2E_PROJECT_ID,
    ],
    { env: emulatorEnv, silent: true },
  )

  let emulatorLog = ""
  emulators.stdout?.on("data", (chunk) => {
    emulatorLog += chunk.toString()
  })
  emulators.stderr?.on("data", (chunk) => {
    emulatorLog += chunk.toString()
  })

  emulators.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(emulatorLog)
    }
  })

  try {
    await Promise.all([
      waitForPort(FIRESTORE_HOST, "Emulatorul Firestore"),
      waitForPort(AUTH_HOST, "Emulatorul Auth"),
      waitForPort(STORAGE_HOST, "Emulatorul Storage"),
    ])
  } catch (error) {
    console.error(emulatorLog)
    throw error
  }

  console.log("→ Resetez și populez emulatorii...")
  await runToCompletion("node", ["scripts/e2e-seed.mjs"])

  console.log("→ Construiesc aplicația pentru testare...")
  await runToCompletion("npx", ["next", "build"])

  console.log("→ Rulez testele Playwright...")
  await runToCompletion("npx", ["playwright", "test", ...passthroughArgs])
}

main()
  .then(() => {
    shutdown()
    process.exit(0)
  })
  .catch((error) => {
    console.error(`\n${error.message}`)
    shutdown()
    process.exit(1)
  })
