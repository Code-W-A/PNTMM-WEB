import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Container } from "@/components/layout/container"
import { NewsList } from "@/components/news/news-list"
import { COVER_ASPECT } from "@/components/shared/editorial-media"
import { PageHero } from "@/components/shared/page-hero"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/config/site"
import {
  getNews,
  getNewsBySlug,
  getRelatedNews,
} from "@/services/content-service"

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>
}

const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

export const revalidate = 300

export async function generateStaticParams() {
  return (await getNews()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)

  if (!item) {
    return { title: "Știre indisponibilă" }
  }

  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      type: "article",
      title: item.title,
      description: item.excerpt,
      publishedTime: item.publishedAt,
      ...(siteConfig.domain && item.imageUrl
        ? { images: [item.imageUrl] }
        : {}),
    },
  }
}

export default async function NewsDetailPage({
  params,
}: NewsDetailPageProps) {
  const { slug } = await params
  const item = await getNewsBySlug(slug)

  if (!item) {
    return notFound()
  }

  const related = await getRelatedNews(item.slug)

  return (
    <>
      <article>
        <PageHero
          title={item.title}
          description={item.excerpt}
          currentLabel={item.title}
          parent={{ href: "/stiri", label: "Știri" }}
          eyebrow={item.category}
          imageUrl={item.imageUrl}
          mediaAlt={`Imagine pentru ${item.title}`}
          mediaLabel={item.category}
          mediaAspect={COVER_ASPECT}
          compact
          meta={
            <p className="font-semibold text-white/80">
              {item.category} · {dateFormatter.format(new Date(item.publishedAt))}
            </p>
          }
        />
        <Container className="max-w-4xl py-12 sm:py-16 lg:py-20">
          <div className="space-y-6 text-lg leading-8 text-foreground/90">
            {item.content.split("\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t bg-muted/40 py-16">
          <Container>
            <SectionHeading title="Alte știri" eyebrow="Continuă lectura" />
            <div className="mt-8">
              <NewsList items={related} />
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
