import { submitPublicForm } from "@/lib/api/public-form"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { contactSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  return submitPublicForm({
    request,
    schema: contactSchema,
    collection: COLLECTIONS.contactMessages,
    context: "forms/contact",
    toDocument: ({ name, email, subject, message }, user) => ({
      name,
      email: user?.email ?? email,
      uid: user?.uid,
      subject,
      message,
    }),
  })
}
