import "server-only"

import { getAppCheck } from "firebase-admin/app-check"

import { ApiError } from "@/lib/api/http"
import { getAdminApp, isFirebaseAdminConfigured } from "@/lib/firebase/admin"

type AppCheckMode = "off" | "monitor" | "enforce"

function currentMode(): AppCheckMode {
  const configured = process.env.APPCHECK_MODE

  if (configured === "enforce") return "enforce"
  if (configured === "off") return "off"
  return "monitor"
}

/**
 * Verificarea App Check pe endpoint-urile publice de formular.
 *
 * În modul `monitor` cererile fără token sunt acceptate și doar semnalate în
 * loguri; trecerea la `enforce` se face după ce monitorizarea confirmă că
 * traficul legitim trimite tokenuri valide. Această etapizare evită blocarea
 * utilizatorilor reali la activare.
 */
export async function verifyAppCheck(request: Request): Promise<void> {
  const mode = currentMode()
  if (mode === "off" || !isFirebaseAdminConfigured()) return

  const token = request.headers.get("x-firebase-appcheck")

  if (!token) {
    if (mode === "enforce") {
      throw new ApiError(401, "appcheck_required", "Cerere neautorizată.")
    }
    console.warn("[appcheck] cerere fără token")
    return
  }

  try {
    await getAppCheck(getAdminApp()).verifyToken(token)
  } catch {
    if (mode === "enforce") {
      throw new ApiError(401, "appcheck_invalid", "Cerere neautorizată.")
    }
    console.warn("[appcheck] token invalid")
  }
}
