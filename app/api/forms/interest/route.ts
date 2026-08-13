import { submitPublicForm } from "@/lib/api/public-form"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { interestSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  return submitPublicForm({
    request,
    schema: interestSchema,
    collection: COLLECTIONS.interestSubmissions,
    context: "forms/interest",
    toDocument: ({ firstName, lastName, email, phone, locality, message }) => ({
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      locality: locality || undefined,
      message,
    }),
  })
}
