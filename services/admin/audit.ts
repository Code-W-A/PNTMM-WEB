import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

/**
 * Log tehnic minimal pentru operațiunile critice: publicări, ștergeri,
 * schimbări de status, dezactivări de conturi și trimiteri de notificări.
 *
 * Se rețin doar identificatori, niciodată conținut sensibil, parole sau
 * tokenuri. Eșecul înregistrării nu blochează operațiunea în sine.
 */
export async function logAdminAction(entry: {
  adminUid: string
  action: string
  entityType: string
  entityId: string
}): Promise<void> {
  try {
    await getAdminDb()
      .collection(COLLECTIONS.adminActions)
      .add({ ...entry, createdAt: FieldValue.serverTimestamp() })
  } catch (error) {
    console.error("[admin] înregistrarea acțiunii a eșuat", error)
  }
}
