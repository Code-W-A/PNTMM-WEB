import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    ...(siteConfig.domain
      ? { sitemap: `${siteConfig.domain.replace(/\/$/, "")}/sitemap.xml` }
      : {}),
  }
}
