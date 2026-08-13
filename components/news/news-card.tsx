import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { EditorialMedia } from "@/components/shared/editorial-media"
import type { NewsItem } from "@/types"

const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border bg-card shadow-[0_18px_55px_-38px_rgba(24,37,99,0.7)] transition duration-500 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_70px_-38px_rgba(24,37,99,0.85)] motion-reduce:hover:translate-y-0">
      <EditorialMedia
        imageUrl={item.imageUrl}
        alt={`Imagine pentru ${item.title}`}
        label={item.category}
        aspect="card"
        className="rounded-none shadow-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
          {item.category} · {dateFormatter.format(new Date(item.publishedAt))}
        </p>
        <h2 className="mt-4 text-balance font-heading text-xl font-bold leading-snug">
          <Link
            href={`/stiri/${item.slug}`}
            className="outline-none after:absolute after:inset-0 focus-visible:underline"
          >
            {item.title}
          </Link>
        </h2>
        <p className="mt-3 flex-1 leading-7 text-muted-foreground">
          {item.excerpt}
        </p>
        <Link
          href={`/stiri/${item.slug}`}
          className="relative z-10 mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary"
        >
          Citiți articolul
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
