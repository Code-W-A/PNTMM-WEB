import { FieldValue } from "firebase-admin/firestore"

import { verifyAppCheck } from "@/lib/api/app-check"
import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import { assertBackendAvailable, validate } from "@/lib/api/public-form"
import { currentDataMode } from "@/lib/data-mode"
import { getAdminDb } from "@/lib/firebase/admin"
import { getOptionalUser } from "@/lib/auth/require-user"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { uploadReportPhoto } from "@/lib/storage/report-photo"
import { reportSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function readFormData(form: FormData) {
  return {
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    subject: String(form.get("subject") ?? ""),
    description: String(form.get("description") ?? ""),
    privacyAccepted: form.get("privacyAccepted") === "true",
  }
}

/** Contractul prevede o singură fotografie per sesizare. */
function readSinglePhoto(form: FormData): File | null {
  const entries = form.getAll("photo").filter((entry) => entry instanceof File)

  if (entries.length > 1) {
    throw new ApiError(
      400,
      "too_many_files",
      "Puteți atașa o singură fotografie.",
    )
  }

  const photo = entries[0]
  return photo && photo.size > 0 ? photo : null
}

export async function POST(request: Request) {
  try {
    await verifyAppCheck(request)
    assertBackendAvailable()

    let form: FormData
    try {
      form = await request.formData()
    } catch {
      throw new ApiError(400, "invalid_request", "Cerere invalidă.")
    }

    const data = validate(reportSchema, readFormData(form))
    const photo = readSinglePhoto(form)
    const user = await getOptionalUser(request)

    const db = getAdminDb()
    const reference = db.collection(COLLECTIONS.reports).doc()

    // Fotografia se încarcă înainte de scrierea documentului, ca sesizarea să
    // nu rămână salvată cu o cale către un fișier inexistent.
    const photoPath = photo
      ? await uploadReportPhoto(reference.id, photo)
      : undefined

    await reference.set({
      name: data.name,
      email: user?.email ?? data.email,
      uid: user?.uid,
      subject: data.subject,
      description: data.description,
      photoPath,
      status: "new",
      dataMode: currentDataMode(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    return jsonOk({ id: reference.id, dataMode: currentDataMode() }, 201)
  } catch (error) {
    return handleApiError(error, "forms/report")
  }
}
