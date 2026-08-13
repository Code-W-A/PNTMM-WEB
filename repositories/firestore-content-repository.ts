import "server-only"

import { getAdminDb } from "@/lib/firebase/admin"
import { COLLECTIONS } from "@/lib/firebase/collections"
import { serializeSnapshot } from "@/lib/firebase/serialize"
import type { Event, NewsItem } from "@/types"

import type { ContentRepository } from "./content-repository"

/**
 * O indisponibilitate a Firestore nu trebuie să oprească build-ul sau să
 * returneze 500 pe o pagină publică. Eroarea este logată, iar pagina se
 * randează goală și se reface la următoarea revalidare.
 */
async function readOrEmpty<T>(
  operation: string,
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await read()
  } catch (error) {
    console.error(`[content] ${operation} a eșuat:`, error)
    return fallback
  }
}

/**
 * Sursa publică de conținut. Interoghează exclusiv documentele publicate,
 * astfel încât ciornele să nu poată ajunge în paginile publice nici din
 * greșeală. Zona de administrare folosește un serviciu separat.
 */
export class FirestoreContentRepository implements ContentRepository {
  async getNews(): Promise<NewsItem[]> {
    return readOrEmpty(
      "getNews",
      async () => {
        const snapshot = await getAdminDb()
          .collection(COLLECTIONS.news)
          .where("status", "==", "published")
          .orderBy("publishedAt", "desc")
          .get()

        return snapshot.docs.map((doc) => serializeSnapshot<NewsItem>(doc))
      },
      [],
    )
  }

  async getNewsBySlug(slug: string): Promise<NewsItem | null> {
    return readOrEmpty(
      `getNewsBySlug(${slug})`,
      async () => {
        const snapshot = await getAdminDb()
          .collection(COLLECTIONS.news)
          .where("slug", "==", slug)
          .where("status", "==", "published")
          .limit(1)
          .get()

        const doc = snapshot.docs[0]
        return doc ? serializeSnapshot<NewsItem>(doc) : null
      },
      null,
    )
  }

  async getEvents(): Promise<Event[]> {
    return readOrEmpty(
      "getEvents",
      async () => {
        const snapshot = await getAdminDb()
          .collection(COLLECTIONS.events)
          .where("status", "==", "published")
          .orderBy("startDate", "asc")
          .get()

        return snapshot.docs.map((doc) => serializeSnapshot<Event>(doc))
      },
      [],
    )
  }

  async getEventBySlug(slug: string): Promise<Event | null> {
    return readOrEmpty(
      `getEventBySlug(${slug})`,
      async () => {
        const snapshot = await getAdminDb()
          .collection(COLLECTIONS.events)
          .where("slug", "==", slug)
          .where("status", "==", "published")
          .limit(1)
          .get()

        const doc = snapshot.docs[0]
        return doc ? serializeSnapshot<Event>(doc) : null
      },
      null,
    )
  }
}
