"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { useAdminAction } from "@/components/admin/admin-form-state"
import { selectTriggerClassName } from "@/components/admin/ui/form-layout"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WORKFLOW_STATUSES, WORKFLOW_STATUS_LABELS } from "@/types/firestore"
import type { WorkflowStatus } from "@/types"

/** Schimbarea de status pentru sesizări, propuneri și cereri de ștergere. */
export function WorkflowStatusSelect({
  entity,
  id,
  status,
}: {
  entity: "sesizari" | "propuneri" | "cereri-stergere"
  id: string
  status: WorkflowStatus
}) {
  const router = useRouter()
  const { state, run } = useAdminAction()
  const [value, setValue] = useState<WorkflowStatus>(status)

  const saving = state.kind === "saving"

  async function change(next: string) {
    const previous = value
    setValue(next as WorkflowStatus)

    const succeeded = await run(
      () =>
        fetch(`/api/admin/submissions/${entity}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        }),
      "Statusul a fost actualizat.",
    )

    if (succeeded) {
      router.refresh()
    } else {
      setValue(previous)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor={`status-${id}`}
          className="text-sm font-semibold text-foreground"
        >
          Status
        </label>
        {saving ? (
          <Loader2
            className="h-4 w-4 animate-spin text-muted-foreground"
            aria-label="Se salvează"
          />
        ) : null}
      </div>

      <Select value={value} onValueChange={change} disabled={saving}>
        <SelectTrigger
          id={`status-${id}`}
          className={`mt-2 ${selectTriggerClassName}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WORKFLOW_STATUSES.map((option) => (
            <SelectItem key={option} value={option}>
              {WORKFLOW_STATUS_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
