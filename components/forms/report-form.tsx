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
import { photoSchema, reportSchema } from "@/lib/validation/forms"
import { submitReport } from "@/services/form-service"
import type { FormSubmitAvailability, ReportFormPayload } from "@/types"

const schema = reportSchema.extend({ photo: photoSchema })

const UNAVAILABLE_MESSAGE =
  "Formularul de sesizări nu este disponibil momentan. Vă rugăm să reveniți în curând."

export function ReportForm({
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
  } = useForm<ReportFormPayload>({
    resolver: zodResolver(schema) as never,
    defaultValues: { privacyAccepted: false, photo: undefined },
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
        title="Sesizarea a fost înregistrată"
        message={state.message}
        actionLabel="Trimiteți o altă sesizare"
        onReset={() => {
          reset({ privacyAccepted: false, photo: undefined })
          resetState()
        }}
      />
    )
  }

  async function onSubmit(values: ReportFormPayload) {
    resetState()
    const response = await submitReport(values)

    if (response.status === "success") {
      reset({ privacyAccepted: false, photo: undefined })
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
      <FormField name="subject" label="Subiect" error={errors.subject}>
        <Input {...register("subject")} />
      </FormField>
      <FormField
        name="description"
        label="Descriere"
        error={errors.description}
      >
        <Textarea rows={8} {...register("description")} />
      </FormField>
      <FormField
        name="photo"
        label="Fotografie"
        optional
        hint="O singură imagine JPG, PNG sau WebP, de cel mult 5 MB."
        error={errors.photo as never}
      >
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          {...register("photo", {
            setValueAs: (files: FileList | undefined) => files?.[0],
          })}
        />
      </FormField>
      <PrivacyField
        error={errors.privacyAccepted}
        register={register("privacyAccepted")}
      />

      <div className="space-y-3" aria-live="polite" aria-atomic="true">
        <SubmissionAlert state={state} onRetry={resetState} />
        <SubmitButton
          isSubmitting={isSubmitting}
          label="Trimiteți sesizarea"
        />
      </div>
    </form>
  )
}
