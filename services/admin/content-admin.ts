import "server-only"

import { FieldValue } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"

import { ApiError } from "@/lib/api/http"
import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { EventInput, NewsInput } from "@/lib/validation/admin"
import type { EventDoc, EventRegistrationDoc, NewsDoc } from "@/types"

import { logAdminAction } from "./audit"
import {
  getDocument,
  isSlugAvailable,
  listDocuments,
} from "./firestore-admin"

/** Paginile publice afectate de o modificare de conținut. */
function revalidateNews(slug?: string) {
  revalidatePath("/")
  revalidatePath("/stiri")
  revalidatePath("/sitemap.xml")
  if (slug) revalidatePath(`/stiri/${slug}`)
}

function revalidateEvents(slug?: string) {
  revalidatePath("/")
  revalidatePath("/evenimente")
  revalidatePath("/sitemap.xml")
  if (slug) revalidatePath(`/evenimente/${slug}`)
}

async function assertSlugAvailable(
  collection: string,
  slug: string,
  excludeId?: string,
) {
  if (!(await isSlugAvailable(collection, slug, excludeId))) {
    throw new ApiError(
      409,
      "slug_taken",
      "Există deja o intrare cu acest slug. Alegeți altul.",
    )
  }
}

// --- Știri -------------------------------------------------------------------

export function listAllNews(limit?: number) {
  return listDocuments<NewsDoc>(COLLECTIONS.news, {
    orderBy: "publishedAt",
    direction: "desc",
    limit,
  })
}

export function getNewsDoc(id: string) {
  return getDocument<NewsDoc>(COLLECTIONS.news, id)
}

export async function createNews(input: NewsInput, adminUid: string) {
  await assertSlugAvailable(COLLECTIONS.news, input.slug)

  const reference = await getAdminDb()
    .collection(COLLECTIONS.news)
    .add({
      ...input,
      imageUrl: input.imageUrl || undefined,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

  revalidateNews(input.slug)
  await logAdminAction({
    adminUid,
    action: `news.create.${input.status}`,
    entityType: "news",
    entityId: reference.id,
  })

  return reference.id
}

export async function updateNews(
  id: string,
  input: NewsInput,
  adminUid: string,
) {
  const existing = await getNewsDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Articolul nu a fost găsit.")
  }

  await assertSlugAvailable(COLLECTIONS.news, input.slug, id)

  await getAdminDb()
    .collection(COLLECTIONS.news)
    .doc(id)
    .update({
      ...input,
      imageUrl: input.imageUrl || FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    })

  revalidateNews(input.slug)
  // Slug-ul se poate schimba; vechea adresă trebuie și ea reîmprospătată.
  if (existing.slug !== input.slug) revalidateNews(existing.slug)

  await logAdminAction({
    adminUid,
    action: `news.update.${input.status}`,
    entityType: "news",
    entityId: id,
  })
}

export async function deleteNews(id: string, adminUid: string) {
  const existing = await getNewsDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Articolul nu a fost găsit.")
  }

  await getAdminDb().collection(COLLECTIONS.news).doc(id).delete()

  revalidateNews(existing.slug)
  await logAdminAction({
    adminUid,
    action: "news.delete",
    entityType: "news",
    entityId: id,
  })
}

// --- Evenimente --------------------------------------------------------------

export function listAllEvents(limit?: number) {
  return listDocuments<EventDoc>(COLLECTIONS.events, {
    orderBy: "startDate",
    direction: "desc",
    limit,
  })
}

export function getEventDoc(id: string) {
  return getDocument<EventDoc>(COLLECTIONS.events, id)
}

export async function createEvent(input: EventInput, adminUid: string) {
  await assertSlugAvailable(COLLECTIONS.events, input.slug)

  const reference = await getAdminDb()
    .collection(COLLECTIONS.events)
    .add({
      ...input,
      imageUrl: input.imageUrl || undefined,
      endDate: input.endDate || undefined,
      address: input.address || undefined,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

  revalidateEvents(input.slug)
  await logAdminAction({
    adminUid,
    action: `event.create.${input.status}`,
    entityType: "event",
    entityId: reference.id,
  })

  return reference.id
}

export async function updateEvent(
  id: string,
  input: EventInput,
  adminUid: string,
) {
  const existing = await getEventDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Evenimentul nu a fost găsit.")
  }

  await assertSlugAvailable(COLLECTIONS.events, input.slug, id)

  await getAdminDb()
    .collection(COLLECTIONS.events)
    .doc(id)
    .update({
      ...input,
      imageUrl: input.imageUrl || FieldValue.delete(),
      endDate: input.endDate || FieldValue.delete(),
      address: input.address || FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp(),
    })

  revalidateEvents(input.slug)
  if (existing.slug !== input.slug) revalidateEvents(existing.slug)

  await logAdminAction({
    adminUid,
    action: `event.update.${input.status}`,
    entityType: "event",
    entityId: id,
  })
}

export async function deleteEvent(id: string, adminUid: string) {
  const existing = await getEventDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Evenimentul nu a fost găsit.")
  }

  await getAdminDb().collection(COLLECTIONS.events).doc(id).delete()

  revalidateEvents(existing.slug)
  await logAdminAction({
    adminUid,
    action: "event.delete",
    entityType: "event",
    entityId: id,
  })
}

export async function listEventRegistrations(eventId: string, limit = 500) {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.eventRegistrations)
    .where("eventId", "==", eventId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get()

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.().toISOString() ?? null,
  })) as EventRegistrationDoc[]
}
