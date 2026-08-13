export interface InterestFormPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  /** Obligatorie doar când interfața o cere; serverul o acceptă opțional. */
  locality?: string
  message: string
  privacyAccepted: boolean
}

export interface ReportFormPayload {
  name: string
  email: string
  subject: string
  description: string
  photo?: File
  privacyAccepted: boolean
}

export interface ProposalFormPayload {
  name: string
  email: string
  title: string
  description: string
  privacyAccepted: boolean
}

export interface ContactFormPayload {
  name: string
  email: string
  subject: string
  message: string
  privacyAccepted: boolean
}

export interface DeletionRequestPayload {
  email: string
  message?: string
  privacyAccepted: boolean
}

export interface EventRegistrationPayload {
  eventId: string
  name: string
  email: string
  phone?: string
  privacyAccepted: boolean
}

/** Capacitate reală a serviciului de submit (separată de UI). */
export type FormSubmitAvailability = "live" | "development" | "unavailable"

export type SubmissionStatus = "success" | "error" | "unavailable"

export interface FormSubmissionResult {
  status: SubmissionStatus
  message: string
  /** Prezent la succes: permite interfeței să anunțe regimul de testare. */
  dataMode?: import("./firestore").DataMode
}
