"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"

import { createInterestSchema } from "@/lib/validation/forms"
import {
  FormField,
  PrivacyField,
} from "@/components/forms/form-elements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitInterest } from "@/services/form-service"
import type { FormSubmitAvailability, InterestFormPayload } from "@/types"
import { cn } from "@/lib/utils"

interface InterestFormProps {
  availability: FormSubmitAvailability
  panel: {
    eyebrow: string
    title: string
    description: string
    points: ReadonlyArray<{ order: number; label: string }>
    disclaimer: string
  }
  form: {
    eyebrow: string
    title: string
    supportingText: string
    messageHint: string
    localityRequired: boolean
    developmentNotice: string
    successTitle: string
    successMessage: string
    unavailableMessage: string
    involvementOptions: ReadonlyArray<{ id: string; label: string }>
  }
}

type SubmitUiState =
  | { kind: "idle" }
  | { kind: "success"; notice?: string }
  | { kind: "error"; message: string }
  | { kind: "unavailable"; message: string }

export function InterestForm({
  availability,
  panel,
  form,
}: InterestFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [submitState, setSubmitState] = useState<SubmitUiState>({ kind: "idle" })
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const schema = useMemo(
    () => createInterestSchema(form.localityRequired),
    [form.localityRequired],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InterestFormPayload>({
    resolver: zodResolver(schema),
    defaultValues: {
      privacyAccepted: false,
      locality: "",
      phone: "",
    },
    shouldFocusError: true,
  })

  useEffect(() => {
    if (
      submitState.kind === "success" ||
      submitState.kind === "error" ||
      submitState.kind === "unavailable"
    ) {
      resultRef.current?.focus()
    }
  }, [submitState.kind])

  function toggleOption(id: string) {
    setSelectedOptions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  async function onSubmit(values: InterestFormPayload) {
    setSubmitState({ kind: "idle" })

    const optionLabels = form.involvementOptions
      .filter((option) => selectedOptions.includes(option.id))
      .map((option) => option.label)

    const messageWithOptions =
      optionLabels.length > 0
        ? `${values.message}\n\n[Opțiuni selectate: ${optionLabels.join(", ")}]`
        : values.message

    const response = await submitInterest({
      ...values,
      phone: values.phone || undefined,
      locality: values.locality || "",
      message: messageWithOptions,
    })

    if (response.status === "success") {
      setSubmitState({
        kind: "success",
        notice: response.dataMode === "test" ? response.message : undefined,
      })
      reset({ privacyAccepted: false, locality: "", phone: "" })
      setSelectedOptions([])
      return
    }

    if (response.status === "unavailable") {
      setSubmitState({
        kind: "unavailable",
        message:
          availability === "development"
            ? response.message
            : form.unavailableMessage,
      })
      return
    }

    setSubmitState({
      kind: "error",
      message: response.message || "Trimiterea a eșuat. Încercați din nou.",
    })
  }

  const showFormShell = availability !== "unavailable"

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-primary/10 bg-card shadow-[0_22px_60px_-40px_rgba(24,37,99,0.55)] lg:grid lg:grid-cols-[minmax(0,36fr)_minmax(0,64fr)]">
      <aside className="relative isolate overflow-hidden bg-primary-dark px-6 py-8 text-white sm:px-8 sm:py-9 lg:px-8 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(125deg, transparent 0 58%, rgb(255 255 255 / 0.04) 58% 59%, transparent 59%), radial-gradient(circle at 12% 88%, rgb(255 212 59 / 0.12), transparent 18rem)",
          }}
        />
        <div className="relative">
          <p className="eyebrow text-accent">{panel.eyebrow}</p>
          <h2 className="mt-3 max-w-[16ch] text-balance font-heading text-[clamp(1.45rem,2.2vw,1.85rem)] font-bold leading-snug tracking-tight">
            {panel.title}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
            {panel.description}
          </p>

          <ol className="mt-8 space-y-5">
            {panel.points.map((point) => (
              <li key={point.order}>
                <span className="meta text-white/45">
                  {String(point.order).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-2 block h-0.5 w-7 bg-accent"
                />
                <p className="mt-2 text-sm font-semibold leading-6 text-white">
                  {point.label}
                </p>
              </li>
            ))}
          </ol>

          <p className="mt-10 max-w-xs border-t border-white/15 pt-5 text-xs leading-5 text-white/55">
            {panel.disclaimer}
          </p>
        </div>
      </aside>

      <div className="bg-card px-5 py-7 sm:px-8 sm:py-9 lg:px-9 lg:py-10">
        {availability === "unavailable" ? (
          <div role="status">
            <p className="eyebrow text-primary">{form.eyebrow}</p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight">
              {form.title}
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              {form.unavailableMessage}
            </p>
          </div>
        ) : null}

        {submitState.kind === "success" ? (
          <div
            ref={resultRef}
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
              {form.successTitle}
            </h2>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">
              {form.successMessage}
            </p>
            {submitState.notice ? (
              <p className="mt-3 max-w-md rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                {submitState.notice}
              </p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="mt-6"
              onClick={() => setSubmitState({ kind: "idle" })}
            >
              Trimiteți un alt formular
            </Button>
          </div>
        ) : null}

        {showFormShell && submitState.kind !== "success" ? (
          <>
            <p className="eyebrow text-primary">{form.eyebrow}</p>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-[1.75rem]">
              {form.title}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {form.supportingText}
            </p>

            {availability === "development" ? (
              <p
                className="mt-3 text-xs leading-5 text-muted-foreground/75"
                role="note"
              >
                {form.developmentNotice}
              </p>
            ) : null}

            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 space-y-4"
              noValidate
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="firstName"
                  label="Prenume"
                  error={errors.firstName}
                >
                  <Input
                    autoComplete="given-name"
                    {...register("firstName")}
                  />
                </FormField>
                <FormField name="lastName" label="Nume" error={errors.lastName}>
                  <Input
                    autoComplete="family-name"
                    {...register("lastName")}
                  />
                </FormField>
              </div>

              <FormField name="email" label="Email" error={errors.email}>
                <Input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                />
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  name="phone"
                  label="Telefon"
                  optional
                  error={errors.phone}
                >
                  <Input type="tel" autoComplete="tel" {...register("phone")} />
                </FormField>
                <FormField
                  name="locality"
                  label="Localitate"
                  optional={!form.localityRequired}
                  error={errors.locality}
                >
                  <Input
                    autoComplete="address-level2"
                    {...register("locality")}
                  />
                </FormField>
              </div>

              {form.involvementOptions.length > 0 ? (
                <fieldset>
                  <legend className="text-sm font-semibold text-foreground">
                    Domenii de interes
                  </legend>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {form.involvementOptions.map((option) => {
                      const active = selectedOptions.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleOption(option.id)}
                          aria-pressed={active}
                          className={cn(
                            "rounded-full border px-3.5 py-2 text-sm font-semibold outline-none ui-transition focus-visible:ring-2 focus-visible:ring-ring",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted/40 text-foreground hover:border-primary/35",
                          )}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              ) : null}

              <FormField
                name="message"
                label="Cum doriți să vă implicați?"
                hint={form.messageHint}
                error={errors.message}
              >
                <Textarea
                  rows={5}
                  className="min-h-[9.5rem] resize-y"
                  {...register("message")}
                />
              </FormField>

              <PrivacyField
                error={errors.privacyAccepted}
                register={register("privacyAccepted")}
              />

              <div className="space-y-3 pt-1" aria-live="polite" aria-atomic="true">
                {submitState.kind === "error" ||
                submitState.kind === "unavailable" ? (
                  <div
                    ref={resultRef}
                    className={cn(
                      "rounded-lg border p-4 text-sm",
                      submitState.kind === "error"
                        ? "border-destructive/40 bg-destructive/5 text-destructive"
                        : "border-border bg-muted/50 text-muted-foreground",
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
                  className="group w-full shadow-[0_10px_28px_-18px_rgba(24,37,99,0.7)] ui-transition hover:-translate-y-px min-[375px]:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Se trimite...
                    </>
                  ) : (
                    <>
                      Trimiteți formularul
                      <ArrowRight
                        aria-hidden="true"
                        className="ui-transition group-hover:translate-x-1"
                      />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </div>
  )
}
