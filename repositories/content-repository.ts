import "server-only"

import { mockEvents, mockNews } from "@/data/mock-content"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import type { Event, NewsItem } from "@/types"

import { FirestoreContentRepository } from "./firestore-content-repository"

export interface ContentRepository {
  getNews(): Promise<NewsItem[]>
  getNewsBySlug(slug: string): Promise<NewsItem | null>
  getEvents(): Promise<Event[]>
  getEventBySlug(slug: string): Promise<Event | null>
}

/** Date demonstrative pentru dezvoltare locală, fără backend configurat. */
class MockContentRepository implements ContentRepository {
  async getNews(): Promise<NewsItem[]> {
    return structuredClone(mockNews)
  }

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    const item = mockNews.find((newsItem) => newsItem.slug === slug)
    return item ? structuredClone(item) : null
  }

  async getEvents(): Promise<Event[]> {
    return structuredClone(mockEvents)
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    const item = mockEvents.find((event) => event.slug === slug)
    return item ? structuredClone(item) : null
  }
}

/**
 * Fără backend, în producție nu se afișează nimic. Conținutul demonstrativ
 * rămâne strict în dezvoltare, ca să nu poată fi publicat din greșeală.
 */
class EmptyContentRepository implements ContentRepository {
  async getNews(): Promise<NewsItem[]> {
    return []
  }

  async getNewsBySlug(): Promise<NewsItem | null> {
    return null
  }

  async getEvents(): Promise<Event[]> {
    return []
  }

  async getEventBySlug(): Promise<Event | null> {
    return null
  }
}

function selectRepository(): ContentRepository {
  if (isFirebaseAdminConfigured()) return new FirestoreContentRepository()
  if (process.env.NODE_ENV === "development") return new MockContentRepository()
  return new EmptyContentRepository()
}

export const contentRepository: ContentRepository = selectRepository()
