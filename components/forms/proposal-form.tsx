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
import { proposalSchema } from "@/lib/validation/forms"
import { submitProposal } from "@/services/form-service"
import type { FormSubmitAvailability, ProposalFormPayload } from "@/types"

const UNAVAILABLE_MESSAGE =
  "Formularul de propuneri nu este disponibil momentan. Vă rugăm să reveniți în curând."

export function ProposalForm({
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
  } = useForm<ProposalFormPayload>({
    resolver: zodResolver(proposalSchema),
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
        title="Propunerea a fost înregistrată"
        message={state.message}
        actionLabel="Trimiteți o altă propunere"
        onReset={() => {
          reset({ privacyAccepted: false })
          resetState()
        }}
      />
    )
  }

  async function onSubmit(values: ProposalFormPayload) {
    resetState()
    const response = await submitProposal(values)

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
      <FormField name="name" label="Nume" error={errors.name}>
        <Input autoComplete="name" {...register("name")} />
      </FormField>
      <FormField name="email" label="Email" error={errors.email}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField name="title" label="Titlul propunerii" error={errors.title}>
        <Input {...register("title")} />
      </FormField>
      <FormField
        name="description"
        label="Descriere"
        error={errors.description}
      >
        <Textarea rows={8} {...register("description")} />
      </FormField>
      <PrivacyField
        error={errors.privacyAccepted}
        register={register("privacyAccepted")}
      />

      <div className="space-y-3" aria-live="polite" aria-atomic="true">
        <SubmissionAlert state={state} onRetry={resetState} />
        <SubmitButton
          isSubmitting={isSubmitting}
          label="Trimiteți propunerea"
        />
      </div>
    </form>
  )
}
