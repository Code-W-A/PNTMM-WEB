import { z } from "zod"

/**
 * Schemele de validare sunt partajate între client și server. Clientul le
 * folosește pentru feedback imediat, serverul le aplică din nou ca sursă de
 * adevăr — o cerere care ocolește interfața este respinsă identic.
 */

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

const email = z
  .string()
  .trim()
  .min(1, "Introduceți adresa de email.")
  .email("Introduceți o adresă de email validă.")

const privacyAccepted = z
  .boolean()
  .refine((accepted) => accepted, "Acceptul este necesar pentru trimitere.")

const optionalPhone = z
  .string()
  .trim()
  .max(30, "Numărul este prea lung.")
  .optional()

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Introduceți numele."),
  email,
  subject: z
    .string()
    .trim()
    .min(3, "Introduceți un subiect.")
    .max(120, "Subiectul poate avea maximum 120 de caractere."),
  message: z
    .string()
    .trim()
    .min(10, "Mesajul trebuie să aibă cel puțin 10 caractere.")
    .max(3000, "Mesajul poate avea maximum 3.000 de caractere."),
  privacyAccepted,
})

export function createInterestSchema(localityRequired: boolean) {
  return z.object({
    firstName: z.string().trim().min(2, "Introduceți prenumele."),
    lastName: z.string().trim().min(2, "Introduceți numele."),
    email,
    phone: optionalPhone,
    locality: localityRequired
      ? z.string().trim().min(2, "Introduceți localitatea.")
      : z.string().trim().optional(),
    message: z
      .string()
      .trim()
      .min(10, "Descrieți în cel puțin 10 caractere cum doriți să vă implicați.")
      .max(2000, "Mesajul poate avea maximum 2.000 de caractere."),
    privacyAccepted,
  })
}

/** Serverul acceptă localitatea ca opțională; obligativitatea ține de interfață. */
export const interestSchema = createInterestSchema(false)

export const reportSchema = z.object({
  name: z.string().trim().min(2, "Introduceți numele."),
  email,
  subject: z
    .string()
    .trim()
    .min(4, "Introduceți subiectul.")
    .max(150, "Subiectul poate avea maximum 150 de caractere."),
  description: z
    .string()
    .trim()
    .min(20, "Descrierea trebuie să aibă cel puțin 20 de caractere.")
    .max(5000, "Descrierea poate avea maximum 5.000 de caractere."),
  privacyAccepted,
})

export const proposalSchema = z.object({
  name: z.string().trim().min(2, "Introduceți numele."),
  email,
  title: z
    .string()
    .trim()
    .min(4, "Introduceți titlul propunerii.")
    .max(150, "Titlul poate avea maximum 150 de caractere."),
  description: z
    .string()
    .trim()
    .min(20, "Descrierea trebuie să aibă cel puțin 20 de caractere.")
    .max(5000, "Descrierea poate avea maximum 5.000 de caractere."),
  privacyAccepted,
})

export const deletionRequestSchema = z.object({
  email,
  message: z
    .string()
    .trim()
    .max(2000, "Mesajul poate avea maximum 2.000 de caractere.")
    .optional(),
  privacyAccepted,
})

export const eventRegistrationSchema = z.object({
  eventId: z.string().trim().min(1, "Eveniment invalid."),
  name: z.string().trim().min(2, "Introduceți numele."),
  email,
  phone: optionalPhone,
  privacyAccepted,
})

/**
 * Un `input[type=file]` expune un `FileList`, iar react-hook-form îl transmite
 * ca atare, chiar și gol când nu s-a ales nimic. Îl reducem la fișierul unic
 * permis de contract înainte de validare.
 */
function singleFile(value: unknown): unknown {
  if (typeof FileList !== "undefined" && value instanceof FileList) {
    return value.length > 0 ? value[0] : undefined
  }

  return value === null ? undefined : value
}

/** Validare a fișierului încărcat, aplicată identic pe client și pe server. */
export const photoSchema = z
  .preprocess(
    singleFile,
    z.custom<File | undefined>(
      (value) =>
        value === undefined ||
        (typeof File !== "undefined" && value instanceof File),
      "Fișierul selectat nu este valid.",
    ),
  )
  .refine(
    (file) =>
      !file ||
      (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type),
    "Folosiți o imagine JPG, PNG sau WebP.",
  )
  .refine(
    (file) => !file || file.size <= MAX_IMAGE_SIZE_BYTES,
    "Imaginea poate avea maximum 5 MB.",
  )
