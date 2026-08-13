import "server-only"

import { FieldValue } from "firebase-admin/firestore"

import { ApiError } from "@/lib/api/http"
import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { createReportPhotoUrl } from "@/lib/storage/report-photo"
import type {
  ContactMessageDoc,
  DeletionRequestDoc,
  InterestSubmissionDoc,
  ProposalDoc,
  ReportDoc,
  WorkflowStatus,
} from "@/types"

import { logAdminAction } from "./audit"
import { getDocument, listDocuments } from "./firestore-admin"

/**
 * Colecțiile din acest modul conțin date personale și nu sunt lizibile public.
 * Accesul trece exclusiv prin endpoint-uri protejate de `requireAdmin`.
 */

export function listReports(status?: string, limit?: number) {
  return listDocuments<ReportDoc>(COLLECTIONS.reports, { status, limit })
}

export function getReport(id: string) {
  return getDocument<ReportDoc>(COLLECTIONS.reports, id)
}

/** Fotografia rămâne privată; se expune doar printr-un link temporar. */
export async function getReportPhotoUrl(report: ReportDoc) {
  if (!report.photoPath) return null

  try {
    return await createReportPhotoUrl(report.photoPath)
  } catch (error) {
    console.error("[admin] generarea linkului fotografiei a eșuat", error)
    return null
  }
}

export function listProposals(status?: string, limit?: number) {
  return listDocuments<ProposalDoc>(COLLECTIONS.proposals, { status, limit })
}

export function getProposal(id: string) {
  return getDocument<ProposalDoc>(COLLECTIONS.proposals, id)
}

export function listContactMessages(limit?: number) {
  return listDocuments<ContactMessageDoc>(COLLECTIONS.contactMessages, {
    limit,
  })
}

export function getContactMessage(id: string) {
  return getDocument<ContactMessageDoc>(COLLECTIONS.contactMessages, id)
}

export function listInterestSubmissions(limit?: number) {
  return listDocuments<InterestSubmissionDoc>(COLLECTIONS.interestSubmissions, {
    limit,
  })
}

export function getInterestSubmission(id: string) {
  return getDocument<InterestSubmissionDoc>(
    COLLECTIONS.interestSubmissions,
    id,
  )
}

export function listDeletionRequests(limit?: number) {
  return listDocuments<DeletionRequestDoc>(COLLECTIONS.deletionRequests, {
    limit,
  })
}

export function getDeletionRequest(id: string) {
  return getDocument<DeletionRequestDoc>(COLLECTIONS.deletionRequests, id)
}

const STATUS_COLLECTIONS = {
  report: COLLECTIONS.reports,
  proposal: COLLECTIONS.proposals,
  deletionRequest: COLLECTIONS.deletionRequests,
} as const

export type StatusEntity = keyof typeof STATUS_COLLECTIONS

export async function updateWorkflowStatus(
  entity: StatusEntity,
  id: string,
  status: WorkflowStatus,
  adminUid: string,
) {
  const collection = STATUS_COLLECTIONS[entity]
  const reference = getAdminDb().collection(collection).doc(id)

  if (!(await reference.get()).exists) {
    throw new ApiError(404, "not_found", "Înregistrarea nu a fost găsită.")
  }

  await reference.update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  })

  await logAdminAction({
    adminUid,
    action: `${entity}.status.${status}`,
    entityType: entity,
    entityId: id,
  })
}
