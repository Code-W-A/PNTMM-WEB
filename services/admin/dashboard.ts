import "server-only"

import { COLLECTIONS } from "@/lib/firebase/collections"
import type {
  ContactMessageDoc,
  DeletionRequestDoc,
  EventDoc,
  InterestSubmissionDoc,
  NewsDoc,
  ProposalDoc,
  ReportDoc,
} from "@/types"

import { listAllEvents, listAllNews } from "./content-admin"
import { countDocuments } from "./firestore-admin"
import {
  listContactMessages,
  listDeletionRequests,
  listInterestSubmissions,
  listProposals,
  listReports,
} from "./submissions-admin"

/**
 * Panoul se construiește exclusiv prin compunerea apelurilor existente: nimic
 * nu se agregă în Firestore și nu apare niciun tip nou de interogare. Numărul de
 * evenimente viitoare se calculează din lista deja adusă, pentru că o
 * numărătoare cu interval de dată ar cere un index nou.
 */

export interface DashboardKpis {
  publishedNews: number
  upcomingEvents: number
  newReports: number
  newProposals: number
}

export type AttentionKind =
  | "report"
  | "proposal"
  | "contact"
  | "interest"
  | "deletion"

export interface AttentionItem {
  key: string
  kind: AttentionKind
  kindLabel: string
  title: string
  person: string
  createdAt: string | null
  href: string
}

export interface DashboardData {
  kpis: DashboardKpis
  attention: AttentionItem[]
  upcomingEvents: EventDoc[]
  recentNews: NewsDoc[]
}

const ATTENTION_LIMIT = 8
const PER_SOURCE_LIMIT = 8

function timeOf(value: string | null | undefined): number {
  if (!value) return 0
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? 0 : time
}

function isUpcoming(event: EventDoc, now: number): boolean {
  return timeOf(event.endDate ?? event.startDate) >= now
}

function fromReports(reports: ReportDoc[]): AttentionItem[] {
  return reports.map((report) => ({
    key: `report-${report.id}`,
    kind: "report" as const,
    kindLabel: "Sesizare",
    title: report.subject,
    person: report.name,
    createdAt: report.createdAt ?? null,
    href: `/admin/sesizari/${report.id}`,
  }))
}

function fromProposals(proposals: ProposalDoc[]): AttentionItem[] {
  return proposals.map((proposal) => ({
    key: `proposal-${proposal.id}`,
    kind: "proposal" as const,
    kindLabel: "Propunere",
    title: proposal.title,
    person: proposal.name,
    createdAt: proposal.createdAt ?? null,
    href: `/admin/propuneri/${proposal.id}`,
  }))
}

function fromContact(messages: ContactMessageDoc[]): AttentionItem[] {
  return messages.map((message) => ({
    key: `contact-${message.id}`,
    kind: "contact" as const,
    kindLabel: "Mesaj de contact",
    title: message.subject,
    person: message.name,
    createdAt: message.createdAt ?? null,
    href: `/admin/formulare/contact/${message.id}`,
  }))
}

function fromInterest(items: InterestSubmissionDoc[]): AttentionItem[] {
  return items.map((item) => ({
    key: `interest-${item.id}`,
    kind: "interest" as const,
    kindLabel: "Formular de interes",
    title: "Cerere de implicare",
    person: `${item.firstName} ${item.lastName}`.trim(),
    createdAt: item.createdAt ?? null,
    href: `/admin/formulare/interes/${item.id}`,
  }))
}

function fromDeletion(requests: DeletionRequestDoc[]): AttentionItem[] {
  return requests.map((request) => ({
    key: `deletion-${request.id}`,
    kind: "deletion" as const,
    kindLabel: "Cerere de ștergere",
    title: "Ștergere de date",
    person: request.email,
    createdAt: request.createdAt ?? null,
    href: `/admin/formulare/stergere/${request.id}`,
  }))
}

const EMPTY: DashboardData = {
  kpis: {
    publishedNews: 0,
    upcomingEvents: 0,
    newReports: 0,
    newProposals: 0,
  },
  attention: [],
  upcomingEvents: [],
  recentNews: [],
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [
      publishedNews,
      newReports,
      newProposals,
      events,
      news,
      reports,
      proposals,
      contactMessages,
      interestSubmissions,
      deletionRequests,
    ] = await Promise.all([
      countDocuments(COLLECTIONS.news, "published"),
      countDocuments(COLLECTIONS.reports, "new"),
      countDocuments(COLLECTIONS.proposals, "new"),
      listAllEvents(200),
      listAllNews(5),
      listReports("new", PER_SOURCE_LIMIT),
      listProposals("new", PER_SOURCE_LIMIT),
      listContactMessages(PER_SOURCE_LIMIT),
      listInterestSubmissions(PER_SOURCE_LIMIT),
      listDeletionRequests(PER_SOURCE_LIMIT),
    ])

    const now = Date.now()
    const upcomingEvents = events
      .filter((event) => isUpcoming(event, now))
      .sort((a, b) => timeOf(a.startDate) - timeOf(b.startDate))

    const attention = [
      ...fromReports(reports),
      ...fromProposals(proposals),
      ...fromContact(contactMessages),
      ...fromInterest(interestSubmissions),
      ...fromDeletion(deletionRequests),
    ]
      .sort((a, b) => timeOf(b.createdAt) - timeOf(a.createdAt))
      .slice(0, ATTENTION_LIMIT)

    return {
      kpis: {
        publishedNews,
        upcomingEvents: upcomingEvents.length,
        newReports,
        newProposals,
      },
      attention,
      upcomingEvents: upcomingEvents.slice(0, 5),
      recentNews: news,
    }
  } catch (error) {
    console.error("[admin] construirea panoului a eșuat", error)
    return EMPTY
  }
}
