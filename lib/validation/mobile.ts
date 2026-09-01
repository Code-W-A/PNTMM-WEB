import { z } from "zod"

export const mobileProfileSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Introduceți numele.")
      .max(100, "Numele poate avea maximum 100 de caractere.")
      .optional(),
    phone: z
      .string()
      .trim()
      .max(30, "Numărul este prea lung.")
      .optional(),
    notificationPreferences: z
      .object({ general: z.boolean() })
      .optional(),
  })
  .refine(
    (value) => Object.values(value).some((item) => item !== undefined),
    "Nu există modificări de salvat.",
  )

export type MobileProfileInput = z.infer<typeof mobileProfileSchema>
