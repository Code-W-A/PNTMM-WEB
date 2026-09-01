import "server-only"

import { FieldValue } from "firebase-admin/firestore"
import { Expo, type ExpoPushMessage } from "expo-server-sdk"

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

interface PushRecipient {
  id: string
  token: string
  provider: "fcm" | "expo"
}

async function collectEnabledTokens(): Promise<PushRecipient[]> {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.pushTokens)
    .where("enabled", "==", true)
    .get()

  return snapshot.docs
    .map((doc) => {
      const data = doc.data()
      const token = data.token as string
      const provider =
        data.provider === "expo" || Expo.isExpoPushToken(token)
          ? "expo"
          : "fcm"
      return { id: doc.id, token, provider } as PushRecipient
    })
    .filter((entry) => Boolean(entry.token))
}

/** Tokenurile respinse definitiv de FCM sunt dezactivate, nu retrimise. */
async function disableTokens(ids: string[]) {
  if (ids.length === 0) return

  for (let start = 0; start < ids.length; start += 450) {
    const batch = getAdminDb().batch()
    for (const id of ids.slice(start, start + 450)) {
      batch.update(getAdminDb().collection(COLLECTIONS.pushTokens).doc(id), {
        enabled: false,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }
    await batch.commit()
  }
}

async function sendFcmNotifications(
  recipients: PushRecipient[],
  input: NotificationInput,
) {
  let successCount = 0
  let failureCount = 0
  const invalidTokenIds: string[] = []

  for (let index = 0; index < recipients.length; index += MULTICAST_BATCH_SIZE) {
    const batch = recipients.slice(index, index + MULTICAST_BATCH_SIZE)
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

  return { successCount, failureCount, invalidTokenIds }
}

async function sendExpoNotifications(
  recipients: PushRecipient[],
  input: NotificationInput,
) {
  const expo = new Expo(
    process.env.EXPO_ACCESS_TOKEN
      ? { accessToken: process.env.EXPO_ACCESS_TOKEN }
      : undefined,
  )
  const valid = recipients.filter((entry) => Expo.isExpoPushToken(entry.token))
  const invalidTokenIds = recipients
    .filter((entry) => !Expo.isExpoPushToken(entry.token))
    .map((entry) => entry.id)
  const messages: ExpoPushMessage[] = valid.map((entry) => ({
    to: entry.token,
    title: input.title,
    body: input.body,
    sound: "default",
    channelId: "general",
  }))

  let successCount = 0
  let failureCount = invalidTokenIds.length
  let offset = 0
  const receiptTokenIds: Record<string, string> = {}

  for (const chunk of expo.chunkPushNotifications(messages)) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk)
      tickets.forEach((ticket, position) => {
        if (ticket.status === "ok") {
          successCount += 1
          if (ticket.id) receiptTokenIds[ticket.id] = valid[offset + position].id
          return
        }

        failureCount += 1
        if (ticket.details?.error === "DeviceNotRegistered") {
          invalidTokenIds.push(valid[offset + position].id)
        }
      })
    } catch (error) {
      console.error("[push] trimiterea lotului Expo a eșuat", error)
      failureCount += chunk.length
    }
    offset += chunk.length
  }

  return { successCount, failureCount, invalidTokenIds, receiptTokenIds }
}

/**
 * Receipt-urile Expo sunt disponibile asincron. Le reconciliem înaintea
 * următoarei trimiteri manuale; DeviceNotRegistered dezactivează definitiv
 * tokenul, iar receipt-urile încă indisponibile rămân pentru următoarea rundă.
 */
async function reconcilePendingExpoReceipts() {
  const pending = await getAdminDb()
    .collection(COLLECTIONS.notifications)
    .where("expoReceiptsPending", "==", true)
    .limit(20)
    .get()

  if (pending.empty) return

  const expo = new Expo(
    process.env.EXPO_ACCESS_TOKEN
      ? { accessToken: process.env.EXPO_ACCESS_TOKEN }
      : undefined,
  )
  const invalidTokenIds: string[] = []

  for (const document of pending.docs) {
    const original = (document.data().expoReceiptTokens ?? {}) as Record<
      string,
      string
    >
    const remaining = { ...original }
    const receiptIds = Object.keys(original)

    try {
      for (const chunk of expo.chunkPushNotificationReceiptIds(receiptIds)) {
        const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
        for (const [receiptId, receipt] of Object.entries(receipts)) {
          delete remaining[receiptId]
          if (
            receipt.status === "error" &&
            receipt.details?.error === "DeviceNotRegistered"
          ) {
            invalidTokenIds.push(original[receiptId])
          }
        }
      }

      await document.ref.update(
        Object.keys(remaining).length > 0
          ? { expoReceiptTokens: remaining }
          : {
              expoReceiptTokens: FieldValue.delete(),
              expoReceiptsPending: false,
            },
      )
    } catch (error) {
      console.warn("[push] receipt-urile Expo nu sunt încă disponibile", error)
    }
  }

  await disableTokens(invalidTokenIds.filter(Boolean))
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

  await reconcilePendingExpoReceipts()
  const tokens = await collectEnabledTokens()
  const [fcmResult, expoResult] = await Promise.all([
    sendFcmNotifications(
      tokens.filter((entry) => entry.provider === "fcm"),
      input,
    ),
    sendExpoNotifications(
      tokens.filter((entry) => entry.provider === "expo"),
      input,
    ),
  ])
  const successCount = fcmResult.successCount + expoResult.successCount
  const failureCount = fcmResult.failureCount + expoResult.failureCount
  const invalidTokenIds = [
    ...fcmResult.invalidTokenIds,
    ...expoResult.invalidTokenIds,
  ]

  await disableTokens(invalidTokenIds)

  await reference.update({
    status: failureCount > 0 && successCount === 0 ? "failed" : "sent",
    sentAt: FieldValue.serverTimestamp(),
    recipientCount: successCount,
    failureCount,
    ...(Object.keys(expoResult.receiptTokenIds).length > 0
      ? {
          expoReceiptTokens: expoResult.receiptTokenIds,
          expoReceiptsPending: true,
        }
      : {}),
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
