import type { ReactNode } from "react"
import type { FieldError } from "react-hook-form"

import { cn } from "@/lib/utils"

/**
 * Layout editorial pentru creare și editare: conținutul la ~70%, panoul de
 * publicare la ~30%, lipit sus pe ecrane mari.
 */
export function FormLayout({
  main,
  aside,
}: {
  main: ReactNode
  aside: ReactNode
}) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-6">{main}</div>
      <aside className="space-y-4 xl:sticky xl:top-6">{aside}</aside>
    </div>
  )
}

/**
 * Câmp fără clonare de props: primitivele Radix (Select, Checkbox) își
 * gestionează singure atributele, iar clonarea le-ar strica.
 */
export function AdminField({
  htmlFor,
  label,
  hint,
  optional = false,
  error,
  children,
  className,
}: {
  htmlFor?: string
  label: string
  hint?: string
  optional?: boolean
  error?: FieldError
  children: ReactNode
  className?: string
}) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined

  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-semibold text-foreground"
      >
        {label}
        {optional ? (
          <span className="ml-1 font-medium text-muted-foreground">
            (opțional)
          </span>
        ) : (
          <span className="ml-0.5 text-primary" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {hint ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
      ) : null}
      <div className="mt-2">{children}</div>
      {error ? (
        <p
          id={errorId}
          className="mt-2 text-sm font-medium text-destructive"
          role="alert"
        >
          {error.message}
        </p>
      ) : null}
    </div>
  )
}

/** Trigger de Select aliniat cu restul câmpurilor din formulare. */
export const selectTriggerClassName = cn(
  "h-11 rounded-lg border-border bg-muted/35 px-3.5 text-sm",
  "focus:border-primary focus:bg-background focus:ring-2 focus:ring-accent/45 focus:ring-offset-0",
)
