"use client"

import Link from "next/link"
import { cloneElement, type ReactElement } from "react"
import type { FieldError } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const fieldClassName =
  "mt-2 flex min-h-11 w-full rounded-lg border border-border bg-muted/35 px-3.5 py-2.5 text-sm text-foreground shadow-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/45 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30"

export function FormField({
  name,
  label,
  optional = false,
  hint,
  error,
  children,
}: {
  name: string
  label: string
  optional?: boolean
  hint?: string
  error?: FieldError
  children: ReactElement
}) {
  const errorId = `${name}-error`
  const hintId = `${name}-hint`
  const childProps = children.props as { className?: string }
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ")

  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-foreground">
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
        <p id={hintId} className="mt-1 text-xs leading-5 text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: name,
        className: cn(fieldClassName, childProps.className),
        "aria-invalid": Boolean(error) || undefined,
        "aria-describedby": describedBy || undefined,
      })}
      <FieldErrorMessage id={errorId} error={error} />
    </div>
  )
}

export function FieldErrorMessage({
  id,
  error,
}: {
  id: string
  error?: FieldError
}) {
  if (!error) return null

  return (
    <p id={id} className="mt-2 text-sm font-medium text-destructive">
      {error.message}
    </p>
  )
}

export function PrivacyField({
  error,
  register: registerProps,
}: {
  error?: FieldError
  register: React.InputHTMLAttributes<HTMLInputElement>
}) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 rounded border-input text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? "privacy-error" : undefined}
          {...registerProps}
        />
        <span>
          Am citit și accept prelucrarea datelor conform{" "}
          <Link
            href="/politica-confidentialitate"
            className="font-semibold text-primary underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Politica de confidențialitate
          </Link>
          .
        </span>
      </label>
      <FieldErrorMessage id="privacy-error" error={error} />
    </div>
  )
}

export function FormActions({
  isSubmitting,
  result,
}: {
  isSubmitting: boolean
  result: string | null
}) {
  return (
    <>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Se trimite…" : "Trimiteți"}
      </Button>
      {result ? (
        <div
          className="rounded-md border border-amber-500/50 bg-amber-50 p-4 text-sm text-amber-950"
          role="status"
          tabIndex={-1}
          data-submission-result
        >
          {result}
        </div>
      ) : null}
    </>
  )
}
