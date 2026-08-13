import Link from "next/link"
import type { ReactNode } from "react"

import { Container } from "@/components/layout/container"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

import { EditorialMedia, type EditorialMediaAspect } from "./editorial-media"

interface PageHeroProps {
  title: string
  description?: string
  currentLabel: string
  parent?: { href: string; label: string }
  eyebrow?: ReactNode
  meta?: ReactNode
  imageUrl?: string | null
  mediaAlt?: string
  mediaLabel?: string
  mediaAspect?: EditorialMediaAspect
  compact?: boolean
  /** Stronger media column (~45%) for storytelling pages like /despre-noi. */
  mediaEmphasis?: boolean
}

export function PageHero({
  title,
  description,
  currentLabel,
  parent,
  eyebrow,
  meta,
  imageUrl,
  mediaAlt,
  mediaLabel = "Cadru editorial",
  mediaAspect = "landscape",
  compact = false,
  mediaEmphasis = false,
}: PageHeroProps) {
  return (
    <header className="relative isolate overflow-hidden border-b bg-primary-dark text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,hsl(var(--accent)/0.16),transparent_26rem),linear-gradient(115deg,transparent_0_56%,rgb(255_255_255/0.035)_56%_57%,transparent_57%)]"
      />
      <Container
        className={cn(
          "relative grid items-center gap-10 py-10 sm:py-14 lg:gap-12 lg:py-20",
          mediaEmphasis
            ? "lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:gap-14",
          compact && "lg:py-14",
        )}
      >
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList className="text-white/65">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-white/70 hover:text-white">
                  <Link href="/">Acasă</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/35" />
              {parent ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild className="text-white/70 hover:text-white">
                      <Link href={parent.href}>{parent.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/35" />
                </>
              ) : null}
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="line-clamp-1 text-white">
                  {currentLabel}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {eyebrow ? (
            <div className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-accent">
              {eyebrow}
            </div>
          ) : null}
          <h1
            className={cn(
              "mt-5 max-w-4xl text-balance font-heading text-4xl font-bold leading-[1.04] tracking-[-0.025em] sm:text-5xl lg:text-6xl",
              !eyebrow && "mt-10",
              compact && "lg:text-5xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-6 text-sm text-white/75">{meta}</div> : null}
        </div>

        <div
          className={cn(
            "relative w-full",
            mediaEmphasis &&
              "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-card)] after:bg-primary-dark/15 after:ring-1 after:ring-inset after:ring-white/10",
          )}
        >
          <EditorialMedia
            imageUrl={imageUrl}
            alt={mediaAlt ?? `Imagine editorială pentru ${title}`}
            label={mediaLabel}
            aspect={mediaAspect}
            priority
            sizes={
              mediaEmphasis
                ? "(min-width: 1024px) 46vw, 100vw"
                : "(min-width: 1024px) 40vw, 100vw"
            }
            className={cn(
              "w-full border border-white/10 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.8)]",
              mediaEmphasis &&
                "animate-[hero-media-in_700ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none",
            )}
          />
          {mediaEmphasis ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-3 -left-3 hidden h-16 w-16 border-b-2 border-l-2 border-accent/70 lg:block"
            />
          ) : null}
        </div>
      </Container>
    </header>
  )
}
