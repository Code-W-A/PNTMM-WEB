import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import type { UserContext } from "@/lib/auth/require-user"
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import type { MobileProfileInput } from "@/lib/validation/mobile"

export interface MobileProfile {
  uid: string
  email: string | null
  displayName: string | null
  phone?: string
  status: "active" | "disabled"
  notificationPreferences: { general: boolean }
  createdAt: string | null
  updatedAt: string | null
}

function iso(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString()
  if (value && typeof value === "object" && "toDate" in value) {
    const date = (value as { toDate: () => Date }).toDate()
    return date.toISOString()
  }
  return typeof value === "string" ? value : null
}

export async function getMobileProfile(uid: string): Promise<MobileProfile> {
  const [authUser, snapshot] = await Promise.all([
    getAdminAuth().getUser(uid),
    getAdminDb().collection(COLLECTIONS.users).doc(uid).get(),
  ])
  const profile = snapshot.data() ?? {}

  return {
    uid,
    email: authUser.email ?? null,
    displayName:
      authUser.displayName ??
      (typeof profile.displayName === "string" ? profile.displayName : null),
    phone: typeof profile.phone === "string" ? profile.phone : undefined,
    status: authUser.disabled ? "disabled" : "active",
    notificationPreferences: {
      general: profile.notificationPreferences?.general !== false,
    },
    createdAt: iso(profile.createdAt) ??
      (authUser.metadata.creationTime
        ? new Date(authUser.metadata.creationTime).toISOString()
        : null),
    updatedAt: iso(profile.updatedAt),
  }
}

async function disableUserPushTokens(uid: string) {
  const snapshot = await getAdminDb()
    .collection(COLLECTIONS.pushTokens)
    .where("uid", "==", uid)
    .get()

  for (let start = 0; start < snapshot.docs.length; start += 450) {
    const batch = getAdminDb().batch()
    snapshot.docs.slice(start, start + 450).forEach((document) => {
      batch.update(document.ref, {
        enabled: false,
        updatedAt: FieldValue.serverTimestamp(),
      })
    })
    await batch.commit()
  }
}

export async function updateMobileProfile(
  user: UserContext,
  input: MobileProfileInput,
): Promise<MobileProfile> {
  const reference = getAdminDb().collection(COLLECTIONS.users).doc(user.uid)
  const existing = await reference.get()

  if (input.displayName !== undefined) {
    await getAdminAuth().updateUser(user.uid, {
      displayName: input.displayName,
    })
  }

  await reference.set(
    {
      uid: user.uid,
      email: user.email ?? null,
      status: "active",
      ...(input.displayName !== undefined
        ? { displayName: input.displayName }
        : {}),
      ...(input.phone !== undefined
        ? { phone: input.phone || FieldValue.delete() }
        : {}),
      ...(input.notificationPreferences !== undefined
        ? { notificationPreferences: input.notificationPreferences }
        : {}),
      ...(!existing.exists
        ? {
            createdAt: FieldValue.serverTimestamp(),
            notificationPreferences:
              input.notificationPreferences ?? { general: true },
          }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  if (input.notificationPreferences?.general === false) {
    await disableUserPushTokens(user.uid)
  }

  return getMobileProfile(user.uid)
}
