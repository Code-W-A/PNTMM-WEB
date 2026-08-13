import {
  ReCaptchaV3Provider,
  getToken,
  initializeAppCheck,
  type AppCheck,
} from "firebase/app-check"

import { getFirebaseApp, isFirebaseClientConfigured } from "./client"

let appCheck: AppCheck | null = null
let initializationAttempted = false

function ensureAppCheck(): AppCheck | null {
  if (initializationAttempted) return appCheck
  initializationAttempted = true

  const siteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY

  if (
    typeof window === "undefined" ||
    !siteKey ||
    !isFirebaseClientConfigured()
  ) {
    return null
  }

  try {
    appCheck = initializeAppCheck(getFirebaseApp(), {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    })
  } catch {
    appCheck = null
  }

  return appCheck
}

/**
 * Antetul App Check pentru cererile către formularele publice.
 *
 * Absența tokenului nu blochează trimiterea: serverul rulează implicit în mod
 * monitorizare. Astfel, App Check poate fi configurat ulterior în Console fără
 * a întrerupe funcționarea formularelor.
 */
export async function appCheckHeaders(): Promise<Record<string, string>> {
  const instance = ensureAppCheck()
  if (!instance) return {}

  try {
    const { token } = await getToken(instance, false)
    return { "X-Firebase-AppCheck": token }
  } catch {
    return {}
  }
}
