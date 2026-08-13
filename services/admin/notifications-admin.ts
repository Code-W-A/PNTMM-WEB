import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import { getAdminDb, getAdminMessaging } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { NotificationInput } from "@/lib/validation/admin"
import type { NotificationDoc } from "@/types"

import { logAdminAction } from "./audit"
import { listDocuments } from "./firestore-admin"

/** FCM acceptă maximum 500 de tokenuri într-un singur apel multicast. */
const MULTICAST_BATCH_SIZE = 500

export function listNotifications(limit = 50) {
  return listDocuments<NotificationDoc>(COLLECTIONS.notifications, { limit })
}

async function collectEnabledTokens(): Promise<
  Array<{ id: string; token: string }>
> {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.pushTokens)
    .where("enabled", "==", true)
    .get()

  return snapshot.docs
    .map((doc) => ({ id: doc.id, token: doc.data().token as string }))
    .filter((entry) => Boolean(entry.token))
}

/** Tokenurile respinse definitiv de FCM sunt dezactivate, nu retrimise. */
async function disableTokens(ids: string[]) {
  if (ids.length === 0) return

  const batch = getAdminDb().batch()

  for (const id of ids) {
    batch.update(getAdminDb().collection(COLLECTIONS.pushTokens).doc(id), {
      enabled: false,
      updatedAt: FieldValue.serverTimestamp(),
    })
  }

  await batch.commit()
}

export interface SendResult {
  notificationId: string
  recipientCount: number
  failureCount: number
}

/**
 * Notificare generală către utilizatorii care au permis notificările.
 * Fără segmentare, fără targetare pe categorii sensibile.
 */
export async function sendGeneralNotification(
  input: NotificationInput,
  adminUid: string,
): Promise<SendResult> {
  const db = getAdminDb()
  const reference = db.collection(COLLECTIONS.notifications).doc()

  await reference.set({
    title: input.title,
    body: input.body,
    status: "draft",
    createdBy: adminUid,
    createdAt: FieldValue.serverTimestamp(),
  })

  const tokens = await collectEnabledTokens()

  let successCount = 0
  let failureCount = 0
  const invalidTokenIds: string[] = []

  for (let index = 0; index < tokens.length; index += MULTICAST_BATCH_SIZE) {
    const batch = tokens.slice(index, index + MULTICAST_BATCH_SIZE)

    const response = await getAdminMessaging().sendEachForMulticast({
      tokens: batch.map((entry) => entry.token),
      notification: { title: input.title, body: input.body },
    })

    successCount += response.successCount
    failureCount += response.failureCount

    response.responses.forEach((result, position) => {
      const code = result.error?.code
      if (
        code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token"
      ) {
        invalidTokenIds.push(batch[position].id)
      }
    })
  }

  await disableTokens(invalidTokenIds)

  await reference.update({
    status: failureCount > 0 && successCount === 0 ? "failed" : "sent",
    sentAt: FieldValue.serverTimestamp(),
    recipientCount: successCount,
    failureCount,
  })

  await logAdminAction({
    adminUid,
    action: "notification.send",
    entityType: "notification",
    entityId: reference.id,
  })

  return {
    notificationId: reference.id,
    recipientCount: successCount,
    failureCount,
  }
}
