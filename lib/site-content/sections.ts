import { aboutPageContent } from "@/data/about-content"
import { contactPageContent } from "@/data/contact-content"
import { involvePageContent } from "@/data/involve-content"

/**
 * Textele fixe ale paginilor publice.
 *
 * Nu sunt administrabile din panou: paginile de prezentare, contact, implicare
 * și cele legale se redactează în cod, nu de către un operator. Aici trăiesc
 * doar fragmentele pe care mai multe pagini le refolosesc; restul conținutului
 * stă în `data/*-content.ts`.
 */
export type SiteContentValues = Record<string, string>

export const SITE_CONTENT: Record<string, SiteContentValues> = {
  about: {
    heroTitle: aboutPageContent.hero.title,
    heroDescription: aboutPageContent.hero.description,
    missionStatement: aboutPageContent.mission.statement,
  },
  contact: {
    heroDescription: contactPageContent.hero.description,
    infoTitle: contactPageContent.info.title,
    infoIntro: contactPageContent.info.intro,
  },
  involvement: {
    heroDescription: involvePageContent.hero.description,
    introTitle: involvePageContent.intro.title,
    introDescription: involvePageContent.intro.description,
  },
}
