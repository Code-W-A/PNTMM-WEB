import { FieldValue } from "firebase-admin/firestore"
import { z } from "zod"

import { verifyAppCheck } from "@/lib/api/app-check"
import { handleApiError, jsonOk } from "@/lib/api/http"
import {
  assertBackendAvailable,
  parseJsonBody,
  validate,
} from "@/lib/api/public-form"
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const schema = z.object({
  token: z.string().trim().min(20, "Token invalid."),
  platform: z.enum(["ios", "android", "web"]),
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

    let uid: string | undefined
    const bearer = request.headers.get("authorization")

    if (bearer?.toLowerCase().startsWith("bearer ")) {
      try {
        const decoded = await getAdminAuth().verifyIdToken(
          bearer.slice(7).trim(),
        )
        uid = decoded.uid
      } catch {
        // Token invalid: dispozitivul se înregistrează fără utilizator asociat.
      }
    }

    await getAdminDb()
      .collection(COLLECTIONS.pushTokens)
      .doc(documentId(data.token))
      .set(
        {
          token: data.token,
          platform: data.platform,
          enabled: data.enabled,
          uid,
          updatedAt: FieldValue.serverTimestamp(),
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      )

    return jsonOk({ success: true }, 201)
  } catch (error) {
    return handleApiError(error, "push-tokens POST")
  }
}
