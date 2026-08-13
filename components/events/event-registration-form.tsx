"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"

import {
  FormField,
  PrivacyField,
} from "@/components/forms/form-elements"
import {
  SubmissionAlert,
  SubmitButton,
  useSubmissionState,
} from "@/components/forms/submission-feedback"
import { Input } from "@/components/ui/input"
import { eventRegistrationSchema } from "@/lib/validation/forms"
import { submitEventRegistration } from "@/services/form-service"
import type { EventRegistrationPayload } from "@/types"

export function EventRegistrationForm({ eventId }: { eventId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const { state, apply, reset: resetState } = useSubmissionState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventRegistrationPayload>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: { eventId, privacyAccepted: false },
    shouldFocusError: true,
  })

  useEffect(() => {
    if (state.kind !== "idle") {
      formRef.current
        ?.querySelector<HTMLElement>("[data-submission-result]")
        ?.focus()
    }
  }, [state.kind])

  if (state.kind === "success") {
    return (
      <div
        className="mt-6 rounded-xl border border-white/20 bg-white/10 p-5 text-sm leading-6 text-white"
        role="status"
        aria-live="polite"
        tabIndex={-1}
        data-submission-result
      >
        <p className="font-semibold">Înscrierea a fost înregistrată.</p>
        <p className="mt-2 text-white/75">{state.message}</p>
      </div>
    )
  }

  async function onSubmit(values: EventRegistrationPayload) {
    resetState()
    const response = await submitEventRegistration(values)

    if (response.status === "success") {
      reset({ eventId, privacyAccepted: false })
    }

    apply(response)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-5 [&_a]:text-white [&_label]:text-white [&_p]:text-white/75"
      noValidate
    >
      <input type="hidden" {...register("eventId")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField name="name" label="Nume" error={errors.name}>
          <Input autoComplete="name" {...register("name")} />
        </FormField>
        <FormField name="email" label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FormField>
      </div>
      <FormField name="phone" label="Telefon" optional error={errors.phone}>
        <Input type="tel" autoComplete="tel" {...register("phone")} />
      </FormField>
      <PrivacyField
        error={errors.privacyAccepted}
        register={register("privacyAccepted")}
      />

      <div className="space-y-3" aria-live="polite" aria-atomic="true">
        <SubmissionAlert state={state} onRetry={resetState} />
        <SubmitButton isSubmitting={isSubmitting} label="Mă înscriu" />
      </div>
    </form>
  )
}
