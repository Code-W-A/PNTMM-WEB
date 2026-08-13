"use client"

import { Check, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export type AdminFormState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }

const GENERIC_ERROR = "Operațiunea nu a reușit. Vă rugăm să încercați din nou."
const NETWORK_ERROR = "Conexiunea a eșuat. Verificați rețeaua și reîncercați."

/**
 * Stările obligatorii pentru orice operațiune din panou, cu confirmare prin
 * toast. Mesajele tehnice ale serverului nu ajung pe ecran: doar texte scurte,
 * scrise pentru administrator.
 */
export function useAdminAction() {
  const [state, setState] = useState<AdminFormState>({ kind: "idle" })
  const { toast } = useToast()

  const run = useCallback(
    async (
      request: () => Promise<Response>,
      successMessage: string,
    ): Promise<boolean> => {
      setState({ kind: "saving" })

      try {
        const response = await request()
        const body = await response.json().catch(() => null)

        if (!response.ok) {
          const message = body?.error?.message ?? GENERIC_ERROR
          setState({ kind: "error", message })
          toast({ variant: "destructive", title: message })
          return false
        }

        setState({ kind: "success", message: successMessage })
        toast({ title: successMessage })
        return true
      } catch {
        setState({ kind: "error", message: NETWORK_ERROR })
        toast({ variant: "destructive", title: NETWORK_ERROR })
        return false
      }
    },
    [toast],
  )

  return { state, run, reset: () => setState({ kind: "idle" }) }
}

/** Eroarea rămâne inline, lângă formular; succesul este confirmat prin toast. */
export function AdminFormFeedback({ state }: { state: AdminFormState }) {
  if (state.kind !== "error") return null

  return (
    <p
      className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
      role="alert"
    >
      {state.message}
    </p>
  )
}

export function AdminSubmitButton({
  state,
  label,
  className,
}: {
  state: AdminFormState
  label: string
  className?: string
}) {
  return (
    <Button type="submit" disabled={state.kind === "saving"} className={className}>
      {state.kind === "saving" ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          Se salvează...
        </>
      ) : (
        label
      )}
    </Button>
  )
}

/**
 * Semnalează discret dacă formularul are modificări nesalvate sau dacă ultima
 * salvare a reușit.
 */
export function SaveStateIndicator({
  isDirty,
  state,
}: {
  isDirty: boolean
  state: AdminFormState
}) {
  if (state.kind === "saving") return null

  if (isDirty) {
    return (
      <p className="text-xs font-medium text-amber-700" role="status">
        Modificări nesalvate
      </p>
    )
  }

  if (state.kind === "success") {
    return (
      <p
        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"
        role="status"
      >
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Salvat
      </p>
    )
  }

  return null
}
