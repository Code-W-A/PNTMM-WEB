"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { CONTACT_PANEL_INSET } from "@/lib/contact-layout"
import { contactSchema } from "@/lib/validation/forms"
import {
  FormField,
  PrivacyField,
} from "@/components/forms/form-elements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitContact } from "@/services/form-service"
import type { ContactFormPayload, FormSubmitAvailability } from "@/types"
import { cn } from "@/lib/utils"

interface ContactFormProps {
  availability: FormSubmitAvailability
  eyebrow: string
  title: string
  supportingText: string
  successTitle: string
  successMessage: string
  unavailableMessage: string
  developmentNotice: string
}

type SubmitUiState =
  | { kind: "idle" }
  | { kind: "success"; notice?: string }
  | { kind: "error"; message: string }
  | { kind: "unavailable"; message: string }

export function ContactForm({
  availability,
  eyebrow,
  title,
  supportingText,
  successTitle,
  successMessage,
  unavailableMessage,
  developmentNotice,
}: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [submitState, setSubmitState] = useState<SubmitUiState>({ kind: "idle" })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { privacyAccepted: false },
    shouldFocusError: true,
  })

  useEffect(() => {
    if (submitState.kind === "success" || submitState.kind === "error") {
      resultRef.current?.focus()
    }
  }, [submitState.kind])

  if (availability === "unavailable") {
    return (
      <div
        className="rounded-[var(--radius-card)] border bg-card p-6 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)] sm:p-8"
        role="status"
      >
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          {unavailableMessage}
        </p>
      </div>
    )
  }

  if (submitState.kind === "success") {
    return (
      <div
        ref={resultRef}
        className="rounded-[var(--radius-card)] border bg-card p-6 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)] sm:p-8"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        data-submission-result
      >
        <CheckCircle2
          className="h-10 w-10 text-primary"
          aria-hidden="true"
        />
        <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight">
          {successTitle}
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">{successMessage}</p>
        {submitState.notice ? (
          <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            {submitState.notice}
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            reset({ privacyAccepted: false })
            setSubmitState({ kind: "idle" })
          }}
        >
          Trimiteți un alt mesaj
        </Button>
      </div>
    )
  }

  async function onSubmit(values: ContactFormPayload) {
    setSubmitState({ kind: "idle" })
    const response = await submitContact(values)

    if (response.status === "success") {
      setSubmitState({
        kind: "success",
        notice: response.dataMode === "test" ? response.message : undefined,
      })
      reset({ privacyAccepted: false })
      return
    }

    if (response.status === "unavailable") {
      setSubmitState({
        kind: "unavailable",
        message:
          availability === "development"
            ? response.message
            : unavailableMessage,
      })
    } else {
      setSubmitState({
        kind: "error",
        message: response.message || "Trimiterea a eșuat. Încercați din nou.",
      })
    }

    requestAnimationFrame(() =>
      formRef.current
        ?.querySelector<HTMLElement>("[data-submission-result]")
        ?.focus(),
    )
  }

  return (
    <div
      className={cn(
        "min-w-0 rounded-[var(--radius-card)] border bg-card pb-5 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)] sm:pb-8 lg:pb-9",
        CONTACT_PANEL_INSET,
      )}
    >
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-[1.75rem]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {supportingText}
      </p>

      {availability === "development" ? (
        <p
          className="mt-4 text-xs leading-5 text-muted-foreground/80"
          role="note"
        >
          {developmentNotice}
        </p>
      ) : null}

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 space-y-4"
        noValidate
      >
        <FormField name="name" label="Nume" error={errors.name}>
          <Input autoComplete="name" {...register("name")} />
        </FormField>
        <FormField name="email" label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
        <FormField name="subject" label="Subiect" error={errors.subject}>
          <Input autoComplete="off" {...register("subject")} />
        </FormField>
        <FormField name="message" label="Mesaj" error={errors.message}>
          <Textarea
            rows={6}
            className="min-h-[9.5rem] resize-y"
            {...register("message")}
          />
        </FormField>
        <PrivacyField
          error={errors.privacyAccepted}
          register={register("privacyAccepted")}
        />

        <div
          className="space-y-3"
          aria-live="polite"
          aria-atomic="true"
        >
          {submitState.kind === "error" || submitState.kind === "unavailable" ? (
            <div
              ref={resultRef}
              className={cn(
                "rounded-lg border p-4 text-sm",
                submitState.kind === "error"
                  ? "border-destructive/40 bg-destructive/5 text-destructive"
                  : "border-amber-500/40 bg-amber-50 text-amber-950",
              )}
              role="alert"
              tabIndex={-1}
              data-submission-result
            >
              <p>{submitState.message}</p>
              {submitState.kind === "error" ? (
                <button
                  type="button"
                  className="mt-2 font-semibold underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => setSubmitState({ kind: "idle" })}
                >
                  Încercați din nou
                </button>
              ) : null}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full shadow-[0_10px_28px_-18px_rgba(24,37,99,0.7)] sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Se trimite...
              </>
            ) : (
              <>
                Trimiteți mesajul
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
