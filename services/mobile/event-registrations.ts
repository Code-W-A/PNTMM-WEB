import "server-only"

import { createHash } from "node:crypto"

import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { EventRegistrationDoc } from "@/types"

export function mobileRegistrationId(eventId: string, uid: string): string {
  return `mobile-${createHash("sha256")
    .update(`${eventId}:${uid}`)
    .digest("hex")
    .slice(0, 40)}`
}

export async function getMobileEventRegistration(
  eventId: string,
  uid: string,
): Promise<EventRegistrationDoc | null> {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.eventRegistrations)
    .doc(mobileRegistrationId(eventId, uid))
    .get()

  if (!snapshot.exists) return null
  const data = snapshot.data() ?? {}

  return {
    id: snapshot.id,
    ...(data as Omit<EventRegistrationDoc, "id" | "createdAt">),
    createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
  } as EventRegistrationDoc
}
