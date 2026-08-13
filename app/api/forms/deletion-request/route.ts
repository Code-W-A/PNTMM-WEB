import { FieldValue } from "firebase-admin/firestore"

import { submitPublicForm } from "@/lib/api/public-form"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { deletionRequestSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Pagina publică inițiază cererea de ștergere; nu șterge date. Procesarea
 * efectivă se face de către operator, conform propriilor proceduri.
 */
export async function POST(request: Request) {
  return submitPublicForm({
    request,
    schema: deletionRequestSchema,
    collection: COLLECTIONS.deletionRequests,
    context: "forms/deletion-request",
    toDocument: ({ email, message }) => ({
      email,
      message: message || undefined,
      status: "new",
      updatedAt: FieldValue.serverTimestamp(),
    }),
  })
}
