import { z } from "zod"

import { WORKFLOW_STATUSES } from "@/types/firestore"

/** Scheme pentru operațiunile de administrare, aplicate server-side. */

const contentStatus = z.enum(["draft", "published"])

const optionalUrl = z
  .string()
  .trim()
  .url("Introduceți o adresă web validă.")
  .or(z.literal(""))
  .optional()

const slug = z
  .string()
  .trim()
  .min(3, "Slug-ul trebuie să aibă cel puțin 3 caractere.")
  .max(80, "Slug-ul poate avea maximum 80 de caractere.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug-ul poate conține doar litere mici, cifre și cratime.",
  )

export const newsInputSchema = z.object({
  slug,
  title: z
    .string()
    .trim()
    .min(4, "Introduceți titlul.")
    .max(200, "Titlul poate avea maximum 200 de caractere."),
  excerpt: z
    .string()
    .trim()
    .min(10, "Introduceți un rezumat.")
    .max(400, "Rezumatul poate avea maximum 400 de caractere."),
  content: z.string().trim().min(20, "Introduceți conținutul articolului."),
  category: z
    .string()
    .trim()
    .min(2, "Introduceți categoria.")
    .max(60, "Categoria poate avea maximum 60 de caractere."),
  imageUrl: optionalUrl,
  publishedAt: z.string().trim().min(1, "Selectați data publicării."),
  status: contentStatus,
})

export const eventInputSchema = z
  .object({
    slug,
    title: z
      .string()
      .trim()
      .min(4, "Introduceți titlul.")
      .max(200, "Titlul poate avea maximum 200 de caractere."),
    description: z
      .string()
      .trim()
      .min(20, "Introduceți descrierea evenimentului."),
    imageUrl: optionalUrl,
    startDate: z.string().trim().min(1, "Selectați data de început."),
    endDate: z.string().trim().optional(),
    location: z.string().trim().min(2, "Introduceți locația."),
    address: z.string().trim().max(200).optional(),
    registrationEnabled: z.boolean(),
    status: contentStatus,
  })
  .refine(
    (event) =>
      !event.endDate ||
      new Date(event.endDate).getTime() >= new Date(event.startDate).getTime(),
    {
      message: "Data de final nu poate fi anterioară datei de început.",
      path: ["endDate"],
    },
  )

export const workflowStatusSchema = z.object({
  status: z.enum(
    WORKFLOW_STATUSES as unknown as [string, ...string[]],
    { message: "Status invalid." },
  ),
})

export const userStatusSchema = z.object({
  status: z.enum(["active", "disabled"], { message: "Status invalid." }),
})

export const notificationInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Introduceți titlul notificării.")
    .max(120, "Titlul poate avea maximum 120 de caractere."),
  body: z
    .string()
    .trim()
    .min(5, "Introduceți conținutul notificării.")
    .max(500, "Textul poate avea maximum 500 de caractere."),
})

export type NewsInput = z.infer<typeof newsInputSchema>
export type EventInput = z.infer<typeof eventInputSchema>
export type NotificationInput = z.infer<typeof notificationInputSchema>
