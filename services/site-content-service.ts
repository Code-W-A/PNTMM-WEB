import {
  SITE_CONTENT,
  type SiteContentValues,
} from "@/lib/site-content/sections"

export type { SiteContentValues }

/**
 * Textele paginilor publice sunt statice și vin din cod. Funcția rămâne
 * asincronă pentru ca paginile care o consumă să nu se schimbe, dar nu mai
 * atinge Firestore: nu există un CMS în panoul de administrare.
 */
export async function getSiteContent(
  sectionKey: string,
): Promise<SiteContentValues> {
  return SITE_CONTENT[sectionKey] ?? {}
}
