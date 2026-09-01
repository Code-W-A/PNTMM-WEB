import { FieldValue } from "firebase-admin/firestore"
import { z } from "zod"

import { verifyAppCheck } from "@/lib/api/app-check"
import { handleApiError, jsonOk } from "@/lib/api/http"
import {
  assertBackendAvailable,
  parseJsonBody,
  validate,
} from "@/lib/api/public-form"
import { getAdminDb } from "@/lib/firebase/admin"
import { getOptionalUser } from "@/lib/auth/require-user"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const schema = z.object({
  token: z.string().trim().min(20, "Token invalid."),
  platform: z.enum(["ios", "android", "web"]),
  provider: z.enum(["fcm", "expo"]).default("fcm"),
  installationId: z.string().trim().min(8).max(160).optional(),
  enabled: z.boolean().default(true),
})

/** Tokenul este identificatorul documentului, ca reînregistrarea să nu dubleze. */
function documentId(token: string): string {
  return Buffer.from(token).toString("base64url").slice(0, 200)
}

/**
 * Înregistrarea unui dispozitiv pentru notificări. Endpoint-ul este pregătit
 * pentru aplicațiile mobile; asocierea cu un utilizator se face doar dacă
 * cererea include un ID token valid.
 */
export async function POST(request: Request) {
  try {
    await verifyAppCheck(request)
    assertBackendAvailable()

    const data = validate(schema, await parseJsonBody(request))

    const user = await getOptionalUser(request)
    let enabled = data.enabled

    if (user && enabled) {
      const profile = await getAdminDb()
        .collection(COLLECTIONS.users)
        .doc(user.uid)
        .get()
      if (profile.data()?.notificationPreferences?.general === false) {
        enabled = false
      }
    }

    const collection = getAdminDb().collection(COLLECTIONS.pushTokens)
    const reference = collection.doc(documentId(data.token))
    const existing = await reference.get()

    if (data.installationId) {
      const previous = await collection
        .where("installationId", "==", data.installationId)
        .get()
      const stale = previous.docs.filter((document) => document.id !== reference.id)
      if (stale.length > 0) {
        const batch = getAdminDb().batch()
        stale.forEach((document) => {
          batch.update(document.ref, {
            enabled: false,
            updatedAt: FieldValue.serverTimestamp(),
          })
        })
        await batch.commit()
      }
    }

    await reference.set(
      {
        token: data.token,
        platform: data.platform,
        provider: data.provider,
        installationId: data.installationId,
        enabled,
        uid: user?.uid ?? FieldValue.delete(),
        updatedAt: FieldValue.serverTimestamp(),
        ...(!existing.exists ? { createdAt: FieldValue.serverTimestamp() } : {}),
      },
      { merge: true },
    )

    return jsonOk({ success: true, enabled }, existing.exists ? 200 : 201)
  } catch (error) {
    return handleApiError(error, "push-tokens POST")
  }
}
