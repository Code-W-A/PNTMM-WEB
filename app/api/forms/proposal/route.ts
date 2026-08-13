import { FieldValue } from "firebase-admin/firestore"

import { submitPublicForm } from "@/lib/api/public-form"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { proposalSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  return submitPublicForm({
    request,
    schema: proposalSchema,
    collection: COLLECTIONS.proposals,
    context: "forms/proposal",
    toDocument: ({ name, email, title, description }) => ({
      name,
      email,
      title,
      description,
      status: "new",
      updatedAt: FieldValue.serverTimestamp(),
    }),
  })
}
