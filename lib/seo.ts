import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

function canonicalUrl(path: string) {
  if (!siteConfig.domain) return undefined

  return new URL(path, `${siteConfig.domain.replace(/\/$/, "")}/`).toString()
}

/**
 * Metadata pentru paginile publice. Canonicalul este emis numai când
 * domeniul oficial este configurat, pentru a evita URL-uri localhost în producție.
 */
export function createRomanianMetadata({
  title,
  description,
  path,
  robots,
}: {
  title: string
  description: string
  path: string
  robots?: Metadata["robots"]
}): Metadata {
  const canonical = canonicalUrl(path)

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(robots ? { robots } : {}),
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      ...(canonical ? { url: canonical } : {}),
      locale: "ro_RO",
      type: "website",
    },
  }
}
