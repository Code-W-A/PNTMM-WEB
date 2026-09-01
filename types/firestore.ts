import type { ContentStatus } from "./content"

/**
 * Tipuri pentru documentele Firestore, în forma serializată folosită de
 * aplicație: datele calendaristice sunt string-uri ISO, nu Timestamp.
 * Conversia se face în `lib/firebase/serialize.ts`.
 */

/** Fluxul de lucru pentru sesizări și propuneri. */
export type WorkflowStatus = "new" | "in_progress" | "closed"

export const WORKFLOW_STATUSES: readonly WorkflowStatus[] = [
  "new",
  "in_progress",
  "closed",
]

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  new: "Nou",
  in_progress: "În lucru",
  closed: "Închis",
}

/** Distinge trimiterile de test de datele reale (poarta REAL_DATA_COLLECTION_ENABLED). */
export type DataMode = "real" | "test"

export type UserStatus = "active" | "disabled"

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface UserDoc extends Timestamps {
  uid: string
  email: string | null
  displayName: string | null
  phone?: string
  status: UserStatus
  notificationPreferences: {
    general: boolean
  }
}

export interface NewsDoc extends Timestamps {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl?: string
  /** Cale Storage internă, folosită la înlocuire și ștergere. */
  imagePath?: string
  category: string
  publishedAt: string
  status: ContentStatus
}

export interface EventDoc extends Timestamps {
  id: string
  slug: string
  title: string
  description: string
  imageUrl?: string
  /** Cale Storage internă, folosită la înlocuire și ștergere. */
  imagePath?: string
  startDate: string
  endDate?: string
  location: string
  address?: string
  registrationEnabled: boolean
  status: ContentStatus
}

export interface EventRegistrationDoc {
  id: string
  eventId: string
  eventSlug: string
  name: string
  email: string
  phone?: string
  uid?: string
  dataMode: DataMode
  createdAt: string
}

export interface ReportDoc extends Timestamps {
  id: string
  name: string
  email: string
  uid?: string
  subject: string
  description: string
  /** Cale în Cloud Storage, nu URL public. Accesul se face prin URL semnat. */
  photoPath?: string
  status: WorkflowStatus
  dataMode: DataMode
}

export interface ProposalDoc extends Timestamps {
  id: string
  name: string
  email: string
  uid?: string
  title: string
  description: string
  status: WorkflowStatus
  dataMode: DataMode
}

export interface ContactMessageDoc {
  id: string
  name: string
  email: string
  uid?: string
  subject: string
  message: string
  dataMode: DataMode
  createdAt: string
}

export interface InterestSubmissionDoc {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  locality?: string
  message: string
  dataMode: DataMode
  createdAt: string
}

export interface DeletionRequestDoc extends Timestamps {
  id: string
  email: string
  message?: string
  /** Prezent doar dacă cererea vine dintr-o sesiune autentificată. */
  uid?: string
  status: WorkflowStatus
  dataMode: DataMode
}

export type NotificationStatus = "draft" | "sent" | "failed"

export interface NotificationDoc {
  id: string
  title: string
  body: string
  status: NotificationStatus
  createdAt: string
  sentAt?: string
  createdBy: string
  recipientCount?: number
  failureCount?: number
  /** Receipt Expo -> ID document token; intern, pentru invalidarea tokenurilor expirate. */
  expoReceiptTokens?: Record<string, string>
  expoReceiptsPending?: boolean
}

export interface PushTokenDoc extends Timestamps {
  id: string
  token: string
  provider?: "fcm" | "expo"
  installationId?: string
  platform: "ios" | "android" | "web"
  uid?: string
  enabled: boolean
}

export interface AdminActionDoc {
  id: string
  adminUid: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
}
