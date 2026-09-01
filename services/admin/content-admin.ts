import "server-only"

import { FieldValue } from "firebase-admin/firestore"
import { revalidatePath } from "next/cache"

import { ApiError } from "@/lib/api/http"
import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import {
  deleteContentImage,
  uploadContentImage,
  type ContentImageKind,
} from "@/lib/storage/content-image"
import type { EventInput, NewsInput } from "@/lib/validation/admin"
import type { EventDoc, EventRegistrationDoc, NewsDoc } from "@/types"

import { logAdminAction } from "./audit"
import {
  getDocument,
  isSlugAvailable,
  listDocuments,
} from "./firestore-admin"

export interface ContentImageOptions {
  file?: File | null
  removeImage?: boolean
  /** `true` când cererea e multipart: imaginea existentă se păstrează dacă nu e fișier sau remove. */
  keepExistingImage?: boolean
}

type CoverExisting = {
  imageUrl?: string
  imagePath?: string
}

type CoverWrite =
  | { action: "skip" }
  | { action: "clear" }
  | { action: "set"; imageUrl: string; imagePath?: string }

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

async function resolveCover(
  kind: ContentImageKind,
  entityId: string,
  existing: CoverExisting | null,
  imageUrl: string | undefined,
  options: ContentImageOptions | undefined,
): Promise<CoverWrite> {
  if (options?.file) {
    if (existing?.imagePath) await deleteContentImage(existing.imagePath)
    const uploaded = await uploadContentImage(kind, entityId, options.file)
    return {
      action: "set",
      imageUrl: uploaded.url,
      imagePath: uploaded.path,
    }
  }

  if (options?.removeImage) {
    if (existing?.imagePath) await deleteContentImage(existing.imagePath)
    return { action: "clear" }
  }

  if (options?.keepExistingImage) return { action: "skip" }

  const nextUrl = imageUrl || undefined
  if (!nextUrl) {
    if (existing?.imagePath) await deleteContentImage(existing.imagePath)
    return existing?.imageUrl || existing?.imagePath
      ? { action: "clear" }
      : { action: "skip" }
  }

  if (nextUrl === existing?.imageUrl) {
    return {
      action: "set",
      imageUrl: nextUrl,
      imagePath: existing?.imagePath,
    }
  }

  if (existing?.imagePath) await deleteContentImage(existing.imagePath)
  return { action: "set", imageUrl: nextUrl }
}

function coverSetFields(cover: CoverWrite): Record<string, unknown> {
  if (cover.action === "set") {
    return {
      imageUrl: cover.imageUrl,
      ...(cover.imagePath ? { imagePath: cover.imagePath } : {}),
    }
  }
  return {}
}

function coverUpdateFields(cover: CoverWrite): Record<string, unknown> {
  if (cover.action === "skip") return {}
  if (cover.action === "clear") {
    return {
      imageUrl: FieldValue.delete(),
      imagePath: FieldValue.delete(),
    }
  }
  return {
    imageUrl: cover.imageUrl,
    imagePath: cover.imagePath || FieldValue.delete(),
  }
}

async function deleteCover(existing: CoverExisting | null) {
  if (existing?.imagePath) await deleteContentImage(existing.imagePath)
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

export async function createNews(
  input: NewsInput,
  adminUid: string,
  options?: ContentImageOptions,
) {
  await assertSlugAvailable(COLLECTIONS.news, input.slug)

  const { imageUrl: inputImageUrl, ...fields } = input
  const reference = getAdminDb().collection(COLLECTIONS.news).doc()
  const cover = await resolveCover(
    "news",
    reference.id,
    null,
    inputImageUrl,
    options,
  )

  await reference.set({
    ...fields,
    ...coverSetFields(cover),
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
  options?: ContentImageOptions,
) {
  const existing = await getNewsDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Articolul nu a fost găsit.")
  }

  await assertSlugAvailable(COLLECTIONS.news, input.slug, id)

  const { imageUrl: inputImageUrl, ...fields } = input
  const cover = await resolveCover("news", id, existing, inputImageUrl, options)

  await getAdminDb()
    .collection(COLLECTIONS.news)
    .doc(id)
    .update({
      ...fields,
      ...coverUpdateFields(cover),
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

  await deleteCover(existing)
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

export async function createEvent(
  input: EventInput,
  adminUid: string,
  options?: ContentImageOptions,
) {
  await assertSlugAvailable(COLLECTIONS.events, input.slug)

  const { imageUrl: inputImageUrl, ...fields } = input
  const reference = getAdminDb().collection(COLLECTIONS.events).doc()
  const cover = await resolveCover(
    "events",
    reference.id,
    null,
    inputImageUrl,
    options,
  )

  await reference.set({
    ...fields,
    ...coverSetFields(cover),
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
  options?: ContentImageOptions,
) {
  const existing = await getEventDoc(id)
  if (!existing) {
    throw new ApiError(404, "not_found", "Evenimentul nu a fost găsit.")
  }

  await assertSlugAvailable(COLLECTIONS.events, input.slug, id)

  const { imageUrl: inputImageUrl, ...fields } = input
  const cover = await resolveCover(
    "events",
    id,
    existing,
    inputImageUrl,
    options,
  )

  await getAdminDb()
    .collection(COLLECTIONS.events)
    .doc(id)
    .update({
      ...fields,
      ...coverUpdateFields(cover),
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

  await deleteCover(existing)
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
