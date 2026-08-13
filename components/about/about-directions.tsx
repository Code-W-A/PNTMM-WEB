import Image from "next/image"

import { Container } from "@/components/layout/container"
import { Reveal, RevealItem, RevealStagger } from "@/components/shared/reveal"
import { cn } from "@/lib/utils"
import type { AboutPageContent, DirectionItem } from "@/types"

interface AboutDirectionsProps {
  intro: string
  directions: DirectionItem[]
  sourceNote?: AboutPageContent["sourceNote"]
}

function DirectionCard({
  item,
  featured = false,
}: {
  item: DirectionItem
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--radius-card)] bg-primary-dark",
        featured ? "min-h-[20rem] lg:min-h-0 lg:h-full" : "min-h-[14rem] lg:min-h-0 lg:h-full",
      )}
    >
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={`Imagine pentru ${item.title}`}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 66vw, 100vw"
              : "(min-width: 1024px) 33vw, 100vw"
          }
          className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/50 to-primary-dark/10 transition-opacity duration-[400ms] group-hover:opacity-95"
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 text-white",
          featured ? "p-6 sm:p-8" : "p-5 sm:p-6",
        )}
      >
        <span className="meta text-accent">
          {String(item.order).padStart(2, "0")}
          {item.isDemo ? " · imagine ilustrativă" : ""}
        </span>
        <h3
          className={cn(
            "mt-3 font-heading font-bold",
            featured ? "max-w-xl text-2xl sm:text-3xl" : "text-lg sm:text-xl",
          )}
        >
          {item.title}
        </h3>
        <p
          className={cn(
            "mt-2 leading-7 text-white/80",
            featured ? "max-w-lg" : "line-clamp-3 text-sm sm:text-base",
          )}
        >
          {item.description}
        </p>
      </div>
    </article>
  )
}

export function AboutDirections({
  intro,
  directions,
  sourceNote,
}: AboutDirectionsProps) {
  const items = [...directions].sort((a, b) => a.order - b.order)
  const [featured, ...rest] = items
  const secondary = rest.slice(0, 2)

  if (!featured) return null

  return (
    <section
      id="directii"
      aria-labelledby="directii-title"
      className="about-anchor section-padding overflow-hidden bg-muted/40"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary">Direcții</p>
          <h2
            id="directii-title"
            className="mt-3 max-w-[18ch] text-balance font-heading text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-tight"
          >
            Direcții de acțiune
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:grid-rows-2 lg:gap-5 lg:min-h-[34rem]">
          <RevealItem as="div" className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <DirectionCard item={featured} featured />
          </RevealItem>

          {secondary.map((item) => (
            <RevealItem key={item.id} as="div" className="min-h-0">
              <DirectionCard item={item} />
            </RevealItem>
          ))}
        </RevealStagger>

        {sourceNote ? (
          <Reveal className="mt-8">
            <p className="text-sm leading-7 text-muted-foreground">
              {sourceNote.text}{" "}
              <a
                href={sourceNote.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary underline underline-offset-4 outline-none ui-transition hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {sourceNote.linkLabel}
              </a>
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  )
}
