import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"
import { getEvents, getNews } from "@/services/content-service"

const staticRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/despre-noi", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/stiri", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/evenimente", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/implica-te", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.7 },
  {
    path: "/politica-confidentialitate",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    path: "/termeni-si-conditii",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
]

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.domain) return []

  const baseUrl = siteConfig.domain.replace(/\/$/, "")
  const [news, events] = await Promise.all([getNews(), getEvents()])

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      changeFrequency,
      priority,
    })),
    ...news.map((item) => ({
      url: `${baseUrl}/stiri/${item.slug}`,
      lastModified: new Date(item.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...events.map((event) => ({
      url: `${baseUrl}/evenimente/${event.slug}`,
      lastModified: new Date(event.startDate),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]
}
