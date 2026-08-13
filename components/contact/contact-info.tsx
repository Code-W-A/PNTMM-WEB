import Link from "next/link"
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  type LucideIcon,
} from "lucide-react"

import { ContactChannel } from "@/components/contact/contact-channel"
import type { ContactChannelData, SocialLinkData } from "@/lib/contact-channels"
import { CONTACT_PANEL_TOP } from "@/lib/contact-layout"

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
}

interface ContactInfoProps {
  eyebrow: string
  title: string
  intro: string
  channels: ContactChannelData[]
  socialHeading: string
  socialLinks: SocialLinkData[]
  reportCallout: {
    title: string
    description: string
    reportLabel: string
    reportHref: string
    proposalLabel: string
    proposalHref: string
  }
  involveCta: {
    prefix: string
    label: string
    href: string
  }
}

export function ContactInfo({
  eyebrow,
  title,
  intro,
  channels,
  socialHeading,
  socialLinks,
  reportCallout,
  involveCta,
}: ContactInfoProps) {
  const hasChannels = channels.length > 0
  const hasSocial = socialLinks.length > 0

  return (
    <div className="min-w-0">
      {/*
        Invisible twin of the form card chrome (border + same padding)
        so "Contact direct" shares the baseline with "Scrie-ne".
      */}
      <div
        className={`rounded-[var(--radius-card)] border border-transparent ${CONTACT_PANEL_TOP}`}
      >
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h2 className="mt-3 max-w-[14ch] text-balance font-heading text-[clamp(1.75rem,2.8vw,2.5rem)] font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-3 max-w-sm text-base leading-7 text-muted-foreground">
          {intro}
        </p>

        <div className="mt-7 space-y-7">
          {hasChannels ? (
            <ul className="divide-y border-y">
              {channels.map((channel) => (
                <li key={channel.type}>
                  <ContactChannel channel={channel} />
                </li>
              ))}
            </ul>
          ) : null}

          {hasSocial ? (
            <div>
              <p className="meta text-muted-foreground/75">{socialHeading}</p>
              <ul className="mt-2 divide-y border-y">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.platform]
                  return (
                    <li key={link.platform}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3.5 py-3 outline-none ui-transition focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/[0.07] text-primary">
                          {Icon ? (
                            <Icon aria-hidden="true" className="h-4 w-4" />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1 text-sm font-semibold text-foreground ui-transition group-hover:text-primary">
                          {link.label}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-3.5 w-3.5 shrink-0 text-primary/40 ui-transition group-hover:translate-x-1 group-hover:text-primary"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          <aside className="rounded-[var(--radius-card)] border border-primary/10 bg-primary-dark px-5 py-5 text-white">
            <h3 className="font-heading text-base font-bold leading-snug sm:text-lg">
              {reportCallout.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
              {reportCallout.description}
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
              <Link
                href={reportCallout.reportHref}
                className="group inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-accent outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
              >
                {reportCallout.reportLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 ui-transition group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={reportCallout.proposalHref}
                className="group inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-white/85 outline-none ui-transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
              >
                {reportCallout.proposalLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 ui-transition group-hover:translate-x-1"
                />
              </Link>
            </div>
          </aside>

          <p className="text-sm leading-6 text-muted-foreground">
            {involveCta.prefix}{" "}
            <Link
              href={involveCta.href}
              className="group inline-flex items-center gap-1 font-semibold text-primary outline-none ui-transition hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {involveCta.label}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 ui-transition group-hover:translate-x-1"
              />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
