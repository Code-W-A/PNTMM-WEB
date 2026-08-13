import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import { ApiError } from "@/lib/api/http"
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { UserDoc, UserStatus } from "@/types"

import { logAdminAction } from "./audit"

export interface AdminUserRow {
  uid: string
  email: string | null
  displayName: string | null
  status: UserStatus
  createdAt: string | null
  lastSignInAt: string | null
  isAdmin: boolean
}

/**
 * Sursa de adevăr pentru conturi este Firebase Authentication, nu Firestore.
 * Documentul din `users` completează profilul, dar starea contului se citește
 * din Auth pentru a nu afișa un flag desincronizat.
 */
export async function listUsers(
  limit = 200,
  search?: string,
): Promise<AdminUserRow[]> {
  const { users } = await getAdminAuth().listUsers(Math.min(limit, 1000))

  const rows = users.map((user) => ({
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    status: (user.disabled ? "disabled" : "active") as UserStatus,
    createdAt: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).toISOString()
      : null,
    lastSignInAt: user.metadata.lastSignInTime
      ? new Date(user.metadata.lastSignInTime).toISOString()
      : null,
    isAdmin:
      user.customClaims?.role === "admin" || user.customClaims?.admin === true,
  }))

  if (!search) return rows

  const term = search.trim().toLowerCase()
  return rows.filter(
    (row) =>
      row.email?.toLowerCase().includes(term) ||
      row.displayName?.toLowerCase().includes(term) ||
      row.uid.toLowerCase().includes(term),
  )
}

/**
 * Dezactivarea se aplică în Firebase Authentication, nu doar ca marcaj în
 * Firestore: altfel contul ar rămâne funcțional pentru aplicațiile mobile.
 */
export async function setUserStatus(
  uid: string,
  status: UserStatus,
  adminUid: string,
) {
  if (uid === adminUid) {
    throw new ApiError(
      400,
      "self_action",
      "Nu vă puteți dezactiva propriul cont.",
    )
  }

  const disabled = status === "disabled"

  try {
    await getAdminAuth().updateUser(uid, { disabled })
  } catch {
    throw new ApiError(404, "not_found", "Utilizatorul nu a fost găsit.")
  }

  if (disabled) {
    // Sesiunile active trebuie invalidate imediat, nu la următoarea expirare.
    await getAdminAuth().revokeRefreshTokens(uid)
  }

  await getAdminDb()
    .collection(COLLECTIONS.users)
    .doc(uid)
    .set(
      { uid, status, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    )

  await logAdminAction({
    adminUid,
    action: `user.${disabled ? "disable" : "enable"}`,
    entityType: "user",
    entityId: uid,
  })
}

export async function getUserProfile(uid: string): Promise<UserDoc | null> {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.users)
    .doc(uid)
    .get()

  return snapshot.exists ? (snapshot.data() as UserDoc) : null
}
