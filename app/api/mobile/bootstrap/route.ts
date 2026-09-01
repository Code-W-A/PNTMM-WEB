import { jsonOk } from "@/lib/api/http"
import { siteConfig } from "@/config/site"

export const dynamic = "force-dynamic"

export async function GET() {
  const baseUrl = siteConfig.domain?.replace(/\/$/, "") ?? ""

  return jsonOk({
    site: {
      name: siteConfig.name,
      fullName: siteConfig.fullName,
      description: siteConfig.description,
      contact: siteConfig.contact,
      social: siteConfig.social,
      legal: {
        privacy: `${baseUrl}/politica-confidentialitate`,
        terms: `${baseUrl}/termeni-si-conditii`,
        deletion: `${baseUrl}/stergere-cont`,
      },
    },
  })
}
