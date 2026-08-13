import "server-only"

import { FieldValue } from "firebase-admin/firestore"
import type { z } from "zod"

import { verifyAppCheck } from "@/lib/api/app-check"
import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import { currentDataMode } from "@/lib/data-mode"
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin"

export function assertBackendAvailable() {
  if (!isFirebaseAdminConfigured()) {
    throw new ApiError(
      503,
      "backend_unavailable",
      "Formularul nu este disponibil momentan. Vă rugăm să reveniți în curând.",
    )
  }
}

/** Primul mesaj de validare este suficient pentru utilizator. */
export function firstIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Datele trimise nu sunt valide."
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    throw new ApiError(400, "invalid_request", "Cerere invalidă.")
  }
}

export function validate<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input)

  if (!parsed.success) {
    throw new ApiError(400, "validation_error", firstIssueMessage(parsed.error))
  }

  return parsed.data
}

interface PublicFormOptions<T> {
  request: Request
  schema: z.ZodType<T>
  collection: string
  context: string
  /** `privacyAccepted` este o condiție de trimitere, nu un câmp de stocat. */
  toDocument: (data: T) => Record<string, unknown>
}

/**
 * Traseul comun al formularelor publice: App Check, disponibilitatea
 * backend-ului, validare server-side, apoi scriere prin Admin SDK cu marcajul
 * modului de date. Clientul nu scrie niciodată direct în Firestore.
 */
export async function submitPublicForm<T>({
  request,
  schema,
  collection,
  context,
  toDocument,
}: PublicFormOptions<T>) {
  try {
    await verifyAppCheck(request)
    assertBackendAvailable()

    const data = validate(schema, await parseJsonBody(request))
    const dataMode = currentDataMode()

    const reference = await getAdminDb()
      .collection(collection)
      .add({
        ...toDocument(data),
        dataMode,
        createdAt: FieldValue.serverTimestamp(),
      })

    return jsonOk({ id: reference.id, dataMode }, 201)
  } catch (error) {
    return handleApiError(error, context)
  }
}
