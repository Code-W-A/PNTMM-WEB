import { withAdmin } from "@/lib/api/admin-route"
import { ApiError } from "@/lib/api/http"
import { csvResponse, toCsv, type CsvColumn } from "@/lib/csv"
import { WORKFLOW_STATUS_LABELS } from "@/types/firestore"
import { listEventRegistrations } from "@/services/admin/content-admin"
import {
  listProposals,
  listReports,
} from "@/services/admin/submissions-admin"
import { listUsers } from "@/services/admin/users-admin"
import type {
  EventRegistrationDoc,
  ProposalDoc,
  ReportDoc,
  WorkflowStatus,
} from "@/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function statusLabel(status: WorkflowStatus) {
  return WORKFLOW_STATUS_LABELS[status] ?? status
}

/**
 * Exporturile conțin exclusiv câmpurile efectiv stocate. Nu există endpoint
 * public de export: fiecare cerere trece prin `requireAdmin`.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ dataset: string }> },
) {
  return withAdmin(request, "admin/export GET", async () => {
    const { dataset } = await params
    const eventId = new URL(request.url).searchParams.get("eventId")

    if (dataset === "utilizatori") {
      const rows = await listUsers(1000)
      const columns: CsvColumn<(typeof rows)[number]>[] = [
        { header: "UID", value: (row) => row.uid },
        { header: "Email", value: (row) => row.email },
        { header: "Nume afișat", value: (row) => row.displayName },
        {
          header: "Status",
          value: (row) => (row.status === "active" ? "Activ" : "Dezactivat"),
        },
        { header: "Creat la", value: (row) => row.createdAt },
        { header: "Ultima autentificare", value: (row) => row.lastSignInAt },
      ]

      return csvResponse(toCsv(rows, columns), "utilizatori.csv")
    }

    if (dataset === "participanti") {
      if (!eventId) {
        throw new ApiError(
          400,
          "missing_event",
          "Specificați evenimentul pentru export.",
        )
      }

      const rows = await listEventRegistrations(eventId, 1000)
      const columns: CsvColumn<EventRegistrationDoc>[] = [
        { header: "Nume", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Telefon", value: (row) => row.phone },
        { header: "Înscris la", value: (row) => row.createdAt },
        { header: "Regim date", value: (row) => row.dataMode },
      ]

      return csvResponse(
        toCsv(rows, columns),
        `participanti-${eventId}.csv`,
      )
    }

    if (dataset === "sesizari") {
      const rows = await listReports(undefined, 1000)
      const columns: CsvColumn<ReportDoc>[] = [
        { header: "ID", value: (row) => row.id },
        { header: "Nume", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Subiect", value: (row) => row.subject },
        { header: "Descriere", value: (row) => row.description },
        { header: "Status", value: (row) => statusLabel(row.status) },
        { header: "Fotografie", value: (row) => (row.photoPath ? "Da" : "Nu") },
        { header: "Creat la", value: (row) => row.createdAt },
      ]

      return csvResponse(toCsv(rows, columns), "sesizari.csv")
    }

    if (dataset === "propuneri") {
      const rows = await listProposals(undefined, 1000)
      const columns: CsvColumn<ProposalDoc>[] = [
        { header: "ID", value: (row) => row.id },
        { header: "Nume", value: (row) => row.name },
        { header: "Email", value: (row) => row.email },
        { header: "Titlu", value: (row) => row.title },
        { header: "Descriere", value: (row) => row.description },
        { header: "Status", value: (row) => statusLabel(row.status) },
        { header: "Creat la", value: (row) => row.createdAt },
      ]

      return csvResponse(toCsv(rows, columns), "propuneri.csv")
    }

    throw new ApiError(404, "not_found", "Setul de date nu există.")
  })
}
