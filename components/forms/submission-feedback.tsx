"use client"

import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { FormSubmissionResult } from "@/types"

export type SubmitUiState =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | { kind: "unavailable"; message: string }

/** Stare comună de trimitere: inactiv, succes, eroare, indisponibil. */
export function useSubmissionState() {
  const [state, setState] = useState<SubmitUiState>({ kind: "idle" })

  const apply = useCallback((result: FormSubmissionResult) => {
    setState({ kind: result.status, message: result.message })
  }, [])

  const reset = useCallback(() => setState({ kind: "idle" }), [])

  return { state, apply, reset }
}

export function FormUnavailableNotice({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border bg-card p-6 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)] sm:p-8"
      role="status"
    >
      <h2 className="font-heading text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">{message}</p>
    </div>
  )
}

export function SubmissionSuccess({
  title,
  message,
  actionLabel,
  onReset,
}: {
  title: string
  message: string
  actionLabel: string
  onReset: () => void
}) {
  return (
    <div
      className="rounded-[var(--radius-card)] border bg-card p-6 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)] sm:p-8"
      role="status"
      aria-live="polite"
      tabIndex={-1}
      data-submission-result
    >
      <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
      <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">
        {title}
      </h2>
      <p className="mt-3 leading-7 text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-6" onClick={onReset}>
        {actionLabel}
      </Button>
    </div>
  )
}

export function SubmissionAlert({
  state,
  onRetry,
}: {
  state: SubmitUiState
  onRetry: () => void
}) {
  if (state.kind !== "error" && state.kind !== "unavailable") return null

  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        state.kind === "error"
          ? "border-destructive/40 bg-destructive/5 text-destructive"
          : "border-amber-500/40 bg-amber-50 text-amber-950",
      )}
      role="alert"
      tabIndex={-1}
      data-submission-result
    >
      <p>{state.message}</p>
      {state.kind === "error" ? (
        <button
          type="button"
          className="mt-2 font-semibold underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onRetry}
        >
          Încercați din nou
        </button>
      ) : null}
    </div>
  )
}

export function SubmitButton({
  isSubmitting,
  label,
  pendingLabel = "Se trimite...",
}: {
  isSubmitting: boolean
  label: string
  pendingLabel?: string
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isSubmitting}
      className="w-full shadow-[0_10px_28px_-18px_rgba(24,37,99,0.7)] sm:w-auto"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight aria-hidden="true" />
        </>
      )}
    </Button>
  )
}
