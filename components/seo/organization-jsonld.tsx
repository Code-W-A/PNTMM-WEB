import { siteConfig } from "@/config/site"

const NATIONAL_PARTY_NAME = "Partidul Național Țărănesc Maniu-Mihalache"
const NATIONAL_PARTY_URL = "https://pntmm.ro"

/**
 * Date structurate despre organizație, construite exclusiv din `siteConfig`.
 * Câmpurile lipsă din configurație sunt omise, ca să nu declarăm către motoarele
 * de căutare informații pe care nu le avem.
 *
 * Adresa și canalele de contact aparțin sediului central, deci stau pe
 * `parentOrganization`. Puse pe organizația județeană, ele ar spune motoarelor
 * de căutare că filiala Cluj se află în București.
 */
export function OrganizationJsonLd() {
  const { contact, domain, fullName, social } = siteConfig

  const sameAs = Object.values(social).filter(Boolean)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: fullName,
    description: siteConfig.description,
    ...(domain
      ? {
          url: domain,
          logo: new URL(siteConfig.logo, domain).toString(),
        }
      : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    parentOrganization: {
      "@type": "PoliticalParty",
      name: NATIONAL_PARTY_NAME,
      url: NATIONAL_PARTY_URL,
      ...(contact.address
        ? {
            address: {
              "@type": "PostalAddress",
              streetAddress: contact.address,
              addressCountry: "RO",
            },
          }
        : {}),
      ...(contact.email || contact.phone
        ? {
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              availableLanguage: "Romanian",
              ...(contact.email ? { email: contact.email } : {}),
              ...(contact.phone ? { telephone: contact.phone } : {}),
            },
          }
        : {}),
    },
  }

  return (
    <script
      type="application/ld+json"
      // Conținutul este construit în cod, nu din input de utilizator.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
