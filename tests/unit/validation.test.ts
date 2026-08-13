import { describe, expect, it } from "vitest"

import { eventInputSchema, newsInputSchema } from "@/lib/validation/admin"
import {
  contactSchema,
  createInterestSchema,
  deletionRequestSchema,
  eventRegistrationSchema,
  proposalSchema,
  reportSchema,
} from "@/lib/validation/forms"

const validContact = {
  name: "Ion Popescu",
  email: "ion@exemplu.ro",
  subject: "Întrebare",
  message: "Aș dori mai multe informații despre activitatea organizației.",
  privacyAccepted: true,
}

describe("validarea formularelor publice", () => {
  it("acceptă un mesaj de contact complet", () => {
    expect(contactSchema.safeParse(validContact).success).toBe(true)
  })

  it("respinge trimiterea fără acceptul de prelucrare a datelor", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      privacyAccepted: false,
    })

    expect(result.success).toBe(false)
  })

  it("respinge o adresă de email invalidă", () => {
    const result = contactSchema.safeParse({
      ...validContact,
      email: "nu-este-email",
    })

    expect(result.success).toBe(false)
  })

  it("respinge un mesaj prea scurt", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "scurt" })
    expect(result.success).toBe(false)
  })

  it("elimină spațiile de la marginile valorilor", () => {
    const result = contactSchema.parse({ ...validContact, name: "  Ana  " })
    expect(result.name).toBe("Ana")
  })

  it("cere localitatea doar când interfața o impune", () => {
    const payload = {
      firstName: "Ana",
      lastName: "Ionescu",
      email: "ana@exemplu.ro",
      message: "Doresc să particip la acțiunile din comunitate.",
      privacyAccepted: true,
    }

    expect(createInterestSchema(false).safeParse(payload).success).toBe(true)
    expect(createInterestSchema(true).safeParse(payload).success).toBe(false)
  })

  it("validează sesizarea, propunerea și cererea de ștergere", () => {
    expect(
      reportSchema.safeParse({
        name: "Ion Popescu",
        email: "ion@exemplu.ro",
        subject: "Sesizare",
        description: "Descrierea detaliată a situației semnalate în cartier.",
        privacyAccepted: true,
      }).success,
    ).toBe(true)

    expect(
      proposalSchema.safeParse({
        name: "Ion Popescu",
        email: "ion@exemplu.ro",
        title: "Propunere",
        description: "Descrierea detaliată a propunerii pentru comunitate.",
        privacyAccepted: true,
      }).success,
    ).toBe(true)

    expect(
      deletionRequestSchema.safeParse({
        email: "ion@exemplu.ro",
        privacyAccepted: true,
      }).success,
    ).toBe(true)
  })

  it("cere identificatorul evenimentului la înscriere", () => {
    const base = {
      name: "Ion Popescu",
      email: "ion@exemplu.ro",
      privacyAccepted: true,
    }

    expect(eventRegistrationSchema.safeParse(base).success).toBe(false)
    expect(
      eventRegistrationSchema.safeParse({ ...base, eventId: "abc123" }).success,
    ).toBe(true)
  })
})

const validNews = {
  slug: "comunicat-de-presa",
  title: "Comunicat de presă",
  excerpt: "Rezumatul comunicatului transmis presei.",
  content: "Conținutul integral al comunicatului de presă publicat.",
  category: "Comunicate",
  imageUrl: "",
  publishedAt: new Date().toISOString(),
  status: "published" as const,
}

describe("validarea conținutului administrat", () => {
  it("acceptă un articol valid", () => {
    expect(newsInputSchema.safeParse(validNews).success).toBe(true)
  })

  it("respinge slug-urile cu majuscule, spații sau diacritice", () => {
    for (const slug of ["Comunicat", "comunicat de presa", "sesizări"]) {
      expect(newsInputSchema.safeParse({ ...validNews, slug }).success).toBe(
        false,
      )
    }
  })

  it("acceptă doar stările draft și published", () => {
    expect(
      newsInputSchema.safeParse({ ...validNews, status: "archived" }).success,
    ).toBe(false)
  })

  it("respinge un eveniment care se încheie înainte de a începe", () => {
    const result = eventInputSchema.safeParse({
      slug: "intalnire-publica",
      title: "Întâlnire publică",
      description: "Descrierea detaliată a întâlnirii publice organizate.",
      startDate: "2026-09-10T18:00:00.000Z",
      endDate: "2026-09-09T18:00:00.000Z",
      location: "Cluj-Napoca",
      registrationEnabled: true,
      status: "published",
    })

    expect(result.success).toBe(false)
  })
})
