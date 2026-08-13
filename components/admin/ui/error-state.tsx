"use client"

import { AlertTriangle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Eroare afișată utilizatorului. Detaliile tehnice rămân în loguri, niciodată
 * pe ecran.
 */
export function ErrorState({
  title = "Nu am putut încărca datele.",
  description = "A apărut o problemă la afișarea acestei secțiuni. Încercați din nou.",
  onRetry,
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-background px-6 py-14 text-center">
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>

      <p className="font-heading text-base font-bold text-foreground">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Încearcă din nou
        </Button>
      ) : null}
    </div>
  )
}
