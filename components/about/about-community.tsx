import Image from "next/image"

import { Container } from "@/components/layout/container"
import { Reveal, RevealItem, RevealStagger } from "@/components/shared/reveal"
import { cn } from "@/lib/utils"
import type { CommunityItem } from "@/types"

interface AboutCommunityProps {
  intro: string
  items: CommunityItem[]
}

function CommunityTile({
  item,
  featured = false,
}: {
  item: CommunityItem
  featured?: boolean
}) {
  const showOverlayMeta = !item.isDemo && (item.caption || item.date)

  return (
    <figure
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--radius-card)] bg-primary-dark",
        featured
          ? "min-h-[18rem] lg:min-h-0 lg:h-full"
          : "min-h-[13rem] lg:min-h-0 lg:h-full",
      )}
    >
      <Image
        src={item.imageUrl}
        alt={item.alt}
        fill
        sizes={
          featured
            ? "(min-width: 1024px) 66vw, 100vw"
            : "(min-width: 1024px) 33vw, 100vw"
        }
        className="object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-primary-dark/55 via-transparent to-transparent opacity-70 transition-opacity duration-[400ms] group-hover:opacity-90"
      />
      {item.isDemo ? (
        <figcaption className="meta absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-10 text-white/75">
          Imagine DEMO
        </figcaption>
      ) : showOverlayMeta ? (
        <figcaption className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4 pt-10 text-white">
          {item.date ? (
            <span className="meta text-accent/90">{item.date}</span>
          ) : null}
          {item.caption ? (
            <span className="mt-1 block text-sm font-semibold">{item.caption}</span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function AboutCommunity({ intro, items }: AboutCommunityProps) {
  if (items.length === 0) return null

  const sorted = [...items].sort((a, b) => a.order - b.order)
  const [featured, ...rest] = sorted
  const secondary = rest.slice(0, 2)

  if (!featured) return null

  return (
    <section
      id="comunitate"
      aria-labelledby="comunitate-title"
      className="about-anchor section-padding overflow-hidden bg-muted/40"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary">Comunitate</p>
          <h2
            id="comunitate-title"
            className="mt-3 max-w-[16ch] text-balance font-heading text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-tight"
          >
            Prezenți în comunitate
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr] lg:grid-rows-2 lg:min-h-[32rem] lg:gap-5">
          <RevealItem
            as="div"
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <CommunityTile item={featured} featured />
          </RevealItem>
          {secondary.map((item) => (
            <RevealItem key={item.id} as="div" className="min-h-0">
              <CommunityTile item={item} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}
