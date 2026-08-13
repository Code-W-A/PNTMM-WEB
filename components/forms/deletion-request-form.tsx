"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"

import {
  FormField,
  PrivacyField,
} from "@/components/forms/form-elements"
import {
  FormUnavailableNotice,
  SubmissionAlert,
  SubmissionSuccess,
  SubmitButton,
  useSubmissionState,
} from "@/components/forms/submission-feedback"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { deletionRequestSchema } from "@/lib/validation/forms"
import { submitDeletionRequest } from "@/services/form-service"
import type { DeletionRequestPayload, FormSubmitAvailability } from "@/types"

const UNAVAILABLE_MESSAGE =
  "Formularul nu este disponibil momentan. Vă rugăm să reveniți în curând."

export function DeletionRequestForm({
  availability,
}: {
  availability: FormSubmitAvailability
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const { state, apply, reset: resetState } = useSubmissionState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeletionRequestPayload>({
    resolver: zodResolver(deletionRequestSchema),
    defaultValues: { privacyAccepted: false },
    shouldFocusError: true,
  })

  useEffect(() => {
    if (state.kind === "error" || state.kind === "unavailable") {
      formRef.current
        ?.querySelector<HTMLElement>("[data-submission-result]")
        ?.focus()
    }
  }, [state.kind])

  if (availability === "unavailable") {
    return (
      <FormUnavailableNotice
        title="Formular indisponibil"
        message={UNAVAILABLE_MESSAGE}
      />
    )
  }

  if (state.kind === "success") {
    return (
      <SubmissionSuccess
        title="Cererea a fost înregistrată"
        message={state.message}
        actionLabel="Trimiteți o altă cerere"
        onReset={() => {
          reset({ privacyAccepted: false })
          resetState()
        }}
      />
    )
  }

  async function onSubmit(values: DeletionRequestPayload) {
    resetState()
    const response = await submitDeletionRequest(values)

    if (response.status === "success") {
      reset({ privacyAccepted: false })
    }

    apply(response)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <FormField
        name="email"
        label="Adresa de email asociată contului"
        error={errors.email}
      >
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField
        name="message"
        label="Detalii suplimentare"
        optional
        hint="Adăugați orice informație care ne ajută să identificăm cererea."
        error={errors.message}
      >
        <Textarea rows={5} {...register("message")} />
      </FormField>
      <PrivacyField
        error={errors.privacyAccepted}
        register={register("privacyAccepted")}
      />

      <div className="space-y-3" aria-live="polite" aria-atomic="true">
        <SubmissionAlert state={state} onRetry={resetState} />
        <SubmitButton isSubmitting={isSubmitting} label="Trimiteți cererea" />
      </div>
    </form>
  )
}
