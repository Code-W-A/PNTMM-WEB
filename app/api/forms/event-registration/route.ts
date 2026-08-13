import { FieldValue } from "firebase-admin/firestore"

import { verifyAppCheck } from "@/lib/api/app-check"
import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import {
  assertBackendAvailable,
  parseJsonBody,
  validate,
} from "@/lib/api/public-form"
import { currentDataMode } from "@/lib/data-mode"
import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { eventRegistrationSchema } from "@/lib/validation/forms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    await verifyAppCheck(request)
    assertBackendAvailable()

    const data = validate(
      eventRegistrationSchema,
      await parseJsonBody(request),
    )

    const db = getAdminDb()
    const eventSnapshot = await db
      .collection(COLLECTIONS.events)
      .doc(data.eventId)
      .get()

    const event = eventSnapshot.data()

    // Starea evenimentului se verifică server-side: ascunderea formularului în
    // interfață nu împiedică o cerere trimisă direct către endpoint.
    if (!eventSnapshot.exists || event?.status !== "published") {
      throw new ApiError(404, "event_not_found", "Evenimentul nu a fost găsit.")
    }

    if (event?.registrationEnabled !== true) {
      throw new ApiError(
        409,
        "registration_closed",
        "Înscrierile pentru acest eveniment nu sunt deschise.",
      )
    }

    const reference = await db.collection(COLLECTIONS.eventRegistrations).add({
      eventId: data.eventId,
      eventSlug: event.slug ?? null,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      dataMode: currentDataMode(),
      createdAt: FieldValue.serverTimestamp(),
    })

    return jsonOk({ id: reference.id, dataMode: currentDataMode() }, 201)
  } catch (error) {
    return handleApiError(error, "forms/event-registration")
  }
}
