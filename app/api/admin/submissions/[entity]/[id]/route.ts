import { withAdmin } from "@/lib/api/admin-route"
import { ApiError, jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
import { workflowStatusSchema } from "@/lib/validation/admin"
import {
  updateWorkflowStatus,
  type StatusEntity,
} from "@/services/admin/submissions-admin"
import type { WorkflowStatus } from "@/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ENTITIES: Record<string, StatusEntity> = {
  sesizari: "report",
  propuneri: "proposal",
  "cereri-stergere": "deletionRequest",
}

/** Schimbarea de status pentru sesizări, propuneri și cereri de ștergere. */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ entity: string; id: string }> },
) {
  return withAdmin(request, "admin/submissions PATCH", async (admin) => {
    const { entity, id } = await params
    const resolved = ENTITIES[entity]

    if (!resolved) {
      throw new ApiError(404, "not_found", "Resursa nu a fost găsită.")
    }

    const { status } = validate(
      workflowStatusSchema,
      await parseJsonBody(request),
    )

    await updateWorkflowStatus(
      resolved,
      id,
      status as WorkflowStatus,
      admin.uid,
    )

    return jsonOk({ success: true })
  })
}
