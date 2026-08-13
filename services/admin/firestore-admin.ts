import "server-only"

import type { Query } from "firebase-admin/firestore"

import { getAdminDb } from "@/lib/firebase/admin"
import { serializeSnapshot } from "@/lib/firebase/serialize"

/** Limita implicită protejează listele administrative de creșterea volumelor. */
export const DEFAULT_PAGE_SIZE = 25
export const MAX_PAGE_SIZE = 200

export interface ListOptions {
  orderBy?: string
  direction?: "asc" | "desc"
  limit?: number
  status?: string
}

export function clampLimit(value: number | undefined): number {
  if (!value || Number.isNaN(value)) return DEFAULT_PAGE_SIZE
  return Math.min(Math.max(Math.trunc(value), 1), MAX_PAGE_SIZE)
}

export async function listDocuments<T>(
  collection: string,
  { orderBy = "createdAt", direction = "desc", limit, status }: ListOptions = {},
): Promise<T[]> {
  let query: Query = getAdminDb().collection(collection)

  if (status) query = query.where("status", "==", status)

  const snapshot = await query
    .orderBy(orderBy, direction)
    .limit(clampLimit(limit))
    .get()

  return snapshot.docs.map((doc) => serializeSnapshot<T>(doc))
}

export async function getDocument<T>(
  collection: string,
  id: string,
): Promise<T | null> {
  const snapshot = await getAdminDb().collection(collection).doc(id).get()
  return snapshot.exists ? serializeSnapshot<T>(snapshot) : null
}

/**
 * Numărătoarea folosește agregarea server-side, ca dashboard-ul să nu descarce
 * colecții întregi doar pentru a afișa un total.
 */
export async function countDocuments(
  collection: string,
  status?: string,
): Promise<number> {
  let query: Query = getAdminDb().collection(collection)
  if (status) query = query.where("status", "==", status)

  const snapshot = await query.count().get()
  return snapshot.data().count
}

export async function isSlugAvailable(
  collection: string,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const snapshot = await getAdminDb()
    .collection(collection)
    .where("slug", "==", slug)
    .limit(2)
    .get()

  return snapshot.docs.every((doc) => doc.id === excludeId)
}
