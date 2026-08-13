import "server-only"

import { Timestamp, type DocumentSnapshot } from "firebase-admin/firestore"

/**
 * Firestore returnează Timestamp, dar componentele React au nevoie de valori
 * serializabile. Conversia se face o singură dată, la marginea stratului de
 * date, ca restul aplicației să lucreze doar cu string-uri ISO.
 */
function normalize(value: unknown): unknown {
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(normalize)

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        normalize(item),
      ]),
    )
  }

  return value
}

export function serializeSnapshot<T>(snapshot: DocumentSnapshot): T {
  return {
    id: snapshot.id,
    ...(normalize(snapshot.data() ?? {}) as Record<string, unknown>),
  } as T
}

export function nowIso(): string {
  return new Date().toISOString()
}
