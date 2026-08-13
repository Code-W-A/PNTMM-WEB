import Image from "next/image"
import { ImageIcon } from "lucide-react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export type EditorialMediaAspect =
  | "hero"
  | "landscape"
  | "portrait"
  | "card"

interface MediaPlaceholderProps {
  alt: string
  label?: string
  aspect?: EditorialMediaAspect
  className?: string
  showLabel?: boolean
}

interface EditorialMediaProps extends MediaPlaceholderProps {
  imageUrl?: string | null
  imageClassName?: string
  priority?: boolean
  sizes?: string
}

const aspectClasses: Record<EditorialMediaAspect, string> = {
  hero: "aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9]",
  landscape: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  card: "aspect-[3/2]",
}

const defaultSizes: Record<EditorialMediaAspect, string> = {
  hero: "100vw",
  landscape: "(min-width: 1024px) 66vw, 100vw",
  portrait: "(min-width: 768px) 40vw, 100vw",
  card: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}

/** Placeholder media intenționat, fără aspect de prototype tehnic. */
export function BrandedImagePlaceholder({
  alt,
  label,
  aspect = "landscape",
  className,
  showLabel = false,
}: MediaPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "editorial-media-pattern relative isolate flex overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(135deg,#24378f_0%,#182563_72%,#101a48_100%)] text-white shadow-[0_20px_55px_-32px_rgba(24,37,99,0.75)]",
        aspectClasses[aspect],
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-[14%] -top-[34%] h-[78%] w-[48%] rotate-12 rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[36%] -left-[10%] h-[70%] w-[46%] rotate-45 border border-accent/20"
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06] sm:h-36 sm:w-36"
      />

      <div className="relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-6">
        {showLabel && label ? (
          <span className="meta w-fit border-l-2 border-accent/80 pl-3 text-white/55">
            {label}
          </span>
        ) : (
          <span aria-hidden="true" />
        )}

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 backdrop-blur-sm">
              <ImageIcon aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="sr-only">Imagine în curs de pregătire</span>
          </div>
          <span className="shrink-0 overflow-hidden rounded-lg shadow-md shadow-black/15 opacity-95">
            <Image
              src={siteConfig.logo}
              alt=""
              width={500}
              height={500}
              className="h-9 w-9 object-cover sm:h-11 sm:w-11"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

/** @deprecated Prefer BrandedImagePlaceholder — păstrat ca alias. */
export const MediaPlaceholder = BrandedImagePlaceholder

export function EditorialMedia({
  imageUrl,
  alt,
  label,
  aspect = "landscape",
  className,
  imageClassName,
  priority = false,
  sizes,
  showLabel = false,
}: EditorialMediaProps) {
  if (!imageUrl) {
    return (
      <BrandedImagePlaceholder
        alt={alt}
        label={label}
        aspect={aspect}
        className={className}
        showLabel={showLabel}
      />
    )
  }

  return (
    <figure
      className={cn(
        "group relative isolate overflow-hidden rounded-[var(--radius-card)] bg-primary-dark shadow-[0_20px_55px_-32px_rgba(24,37,99,0.6)]",
        aspectClasses[aspect],
        className,
      )}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? defaultSizes[aspect]}
        className={cn(
          "object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          imageClassName,
        )}
      />
      {label ? (
        <figcaption className="meta absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-primary-dark/85 to-transparent px-5 pb-4 pt-12 text-white/80">
          {label}
        </figcaption>
      ) : null}
    </figure>
  )
}
