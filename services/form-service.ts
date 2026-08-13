import { appCheckHeaders } from "@/lib/firebase/app-check-client"
import type {
  ContactFormPayload,
  DataMode,
  DeletionRequestPayload,
  EventRegistrationPayload,
  FormSubmissionResult,
  FormSubmitAvailability,
  InterestFormPayload,
  ProposalFormPayload,
  ReportFormPayload,
} from "@/types"

/**
 * Stratul dintre componentele de formular și API. Componentele nu cunosc
 * Firebase și nu construiesc cereri HTTP; semnăturile de aici rămân stabile
 * indiferent de backend.
 */
export function isFormsBackendEnabled(): boolean {
  return process.env.NEXT_PUBLIC_FORMS_ENABLED === "true"
}

export function getFormSubmitAvailability(): FormSubmitAvailability {
  if (isFormsBackendEnabled()) return "live"
  if (process.env.NODE_ENV === "development") return "development"
  return "unavailable"
}

const unavailableResult = (): FormSubmissionResult => ({
  status: "unavailable",
  message:
    "Formularul nu este disponibil momentan. Vă rugăm să reveniți în curând.",
})

const networkErrorResult = (): FormSubmissionResult => ({
  status: "error",
  message:
    "Trimiterea nu a reușit. Verificați conexiunea și încercați din nou.",
})

const GENERIC_ERROR =
  "Trimiterea nu a reușit. Vă rugăm să încercați din nou în câteva momente."

const SUCCESS_MESSAGE =
  "Mesajul a fost înregistrat. Vă mulțumim pentru interesul acordat."

/**
 * Cât timp poarta pentru date reale este închisă, utilizatorul este informat
 * că trimiterea a fost înregistrată în regim de testare.
 */
const TEST_MODE_MESSAGE =
  "Trimiterea a fost înregistrată în regim de testare. Formularul nu colectează încă date reale."

function successResult(dataMode?: DataMode): FormSubmissionResult {
  return {
    status: "success",
    message: dataMode === "test" ? TEST_MODE_MESSAGE : SUCCESS_MESSAGE,
    dataMode,
  }
}

interface ApiResponseBody {
  id?: string
  dataMode?: DataMode
  error?: { code?: string; message?: string }
}

async function send(
  path: string,
  init: RequestInit,
): Promise<FormSubmissionResult> {
  if (!isFormsBackendEnabled()) return unavailableResult()

  try {
    const response = await fetch(path, {
      ...init,
      headers: { ...(init.headers ?? {}), ...(await appCheckHeaders()) },
    })

    const body = (await response.json().catch(() => null)) as
      | ApiResponseBody
      | null

    if (!response.ok) {
      return {
        status: response.status === 503 ? "unavailable" : "error",
        message: body?.error?.message ?? GENERIC_ERROR,
      }
    }

    return successResult(body?.dataMode)
  } catch {
    return networkErrorResult()
  }
}

function postJson(path: string, payload: unknown): Promise<FormSubmissionResult> {
  return send(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
}

export async function submitContact(
  payload: ContactFormPayload,
): Promise<FormSubmissionResult> {
  return postJson("/api/forms/contact", payload)
}

export async function submitInterest(
  payload: InterestFormPayload,
): Promise<FormSubmissionResult> {
  return postJson("/api/forms/interest", payload)
}

export async function submitProposal(
  payload: ProposalFormPayload,
): Promise<FormSubmissionResult> {
  return postJson("/api/forms/proposal", payload)
}

export async function submitDeletionRequest(
  payload: DeletionRequestPayload,
): Promise<FormSubmissionResult> {
  return postJson("/api/forms/deletion-request", payload)
}

export async function submitEventRegistration(
  payload: EventRegistrationPayload,
): Promise<FormSubmissionResult> {
  return postJson("/api/forms/event-registration", payload)
}

/** Sesizarea poate include o fotografie, deci se trimite ca multipart. */
export async function submitReport(
  payload: ReportFormPayload,
): Promise<FormSubmissionResult> {
  const form = new FormData()
  form.append("name", payload.name)
  form.append("email", payload.email)
  form.append("subject", payload.subject)
  form.append("description", payload.description)
  form.append("privacyAccepted", String(payload.privacyAccepted))

  if (payload.photo) {
    form.append("photo", payload.photo)
  }

  return send("/api/forms/report", { method: "POST", body: form })
}
