import "server-only"

import type { DataMode } from "@/types"

/**
 * Poarta pentru colectarea de date reale. Finalizarea tehnică a formularelor
 * nu înseamnă activarea lor pentru date reale: cât timp această variabilă nu
 * este `true`, trimiterile sunt persistate, dar marcate ca date de test, iar
 * interfața anunță explicit acest lucru.
 *
 * Nu este expusă ca setare de administrare — se schimbă doar din environment,
 * pentru a evita activarea accidentală înainte de aprobările necesare.
 */
export function isRealDataCollectionEnabled(): boolean {
  return process.env.REAL_DATA_COLLECTION_ENABLED === "true"
}

export function currentDataMode(): DataMode {
  return isRealDataCollectionEnabled() ? "real" : "test"
}
