import "server-only"

import { aboutPageContent } from "@/data/about-content"
import { contentRepository } from "@/repositories/content-repository"
import type { AboutPageContent, Event, NewsItem } from "@/types"

/** Conținut pagină Despre noi — sursa poate fi schimbată ulterior (admin/API). */
export async function getAboutContent(): Promise<AboutPageContent> {
  return structuredClone(aboutPageContent)
}

export async function getNews(): Promise<NewsItem[]> {
  const news = await contentRepository.getNews()

  return news
    .filter((item) => item.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
}

export async function getNewsBySlug(
  slug: string,
): Promise<NewsItem | null> {
  const item = await contentRepository.getNewsBySlug(slug)
  return item?.status === "published" ? item : null
}

export async function getRelatedNews(
  currentSlug: string,
  limit = 3,
): Promise<NewsItem[]> {
  return (await getNews()).filter((item) => item.slug !== currentSlug).slice(0, limit)
}

export async function getEvents(): Promise<Event[]> {
  const events = await contentRepository.getEvents()

  return events
    .filter((item) => item.status === "published")
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    )
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const item = await contentRepository.getEventBySlug(slug)
  return item?.status === "published" ? item : null
}

export async function getRelatedEvents(
  currentSlug: string,
  limit = 3,
): Promise<Event[]> {
  return (await getEvents())
    .filter((item) => item.slug !== currentSlug)
    .slice(0, limit)
}
