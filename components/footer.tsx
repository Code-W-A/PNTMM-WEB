import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react"

import { Container } from "@/components/layout/container"
import { siteConfig } from "@/config/site"

const socialItems = [
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "youtube", label: "YouTube", icon: Youtube },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
] as const

function FooterNavColumn({
  title,
  items,
}: {
  title: string
  items: { label: string; href: string }[]
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2.5 font-heading text-base font-bold">
        <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group inline-flex min-h-9 items-center gap-2.5 text-sm text-white/65 outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span
                aria-hidden="true"
                className="h-px w-3 shrink-0 bg-white/25 ui-transition group-hover:w-5 group-hover:bg-accent"
              />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Footer() {
  const visibleSocials = socialItems.filter(
    (item) => siteConfig.social[item.key],
  )
  const hasContact = Object.values(siteConfig.contact).some(Boolean)
  const showContactColumn = hasContact || visibleSocials.length > 0

  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-primary-dark text-white">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 -z-10 h-56 w-56 rotate-45 border border-white/[0.02]"
      />

      <Container
        className={
          showContactColumn
            ? "grid gap-8 py-9 sm:py-11 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.15fr_1.15fr_1fr_1fr] lg:gap-12"
            : "grid gap-8 py-9 sm:py-11 md:grid-cols-2 md:gap-10 lg:grid-cols-[1.2fr_1.2fr_1fr] lg:gap-12"
        }
      >
        <div>
          <Link
            href="/"
            className="group inline-flex items-center gap-3.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-dark"
            aria-label={`${siteConfig.name} — pagina principală`}
          >
            <span className="overflow-hidden rounded-xl shadow-lg shadow-black/20 ui-transition group-hover:-translate-y-0.5">
              <Image
                src={siteConfig.logo}
                alt={`Sigla ${siteConfig.name}`}
                width={500}
                height={500}
                className="h-12 w-12 object-cover"
              />
            </span>
            <span className="max-w-[14rem] font-heading text-lg font-bold leading-6">
              {siteConfig.fullName}
            </span>
          </Link>
          {siteConfig.description ? (
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              {siteConfig.description}
            </p>
          ) : null}
          <Link
            href={siteConfig.action.href}
            className="group mt-5 inline-flex min-h-10 items-center gap-2 border-b border-accent/50 pb-1 text-sm font-bold text-accent outline-none ui-transition hover:border-accent hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
          >
            {siteConfig.action.label}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 ui-transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-10">
          {siteConfig.footerNavigation.map((column) => (
            <FooterNavColumn
              key={column.title}
              title={column.title}
              items={column.items}
            />
          ))}
        </div>

        {showContactColumn ? (
          <div>
            <h2 className="flex items-center gap-2.5 font-heading text-base font-bold">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
              Contact
            </h2>
            {hasContact ? (
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                {siteConfig.contact.email ? (
                  <li>
                    <a
                      className="flex min-h-9 items-center gap-2.5 outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
                      href={`mailto:${siteConfig.contact.email}`}
                    >
                      <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                      {siteConfig.contact.email}
                    </a>
                  </li>
                ) : null}
                {siteConfig.contact.phone ? (
                  <li>
                    <a
                      className="flex min-h-9 items-center gap-2.5 outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    >
                      <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-accent" />
                      {siteConfig.contact.phone}
                    </a>
                  </li>
                ) : null}
                {siteConfig.contact.address ? (
                  <li className="flex gap-2.5">
                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      {siteConfig.contact.addressLabel ? (
                        <span className="block text-xs uppercase tracking-[0.08em] text-white/45">
                          {siteConfig.contact.addressLabel}
                        </span>
                      ) : null}
                      {siteConfig.contact.address}
                    </span>
                  </li>
                ) : null}
              </ul>
            ) : null}
            {visibleSocials.length > 0 ? (
              <div className={hasContact ? "mt-5 flex gap-2" : "mt-4 flex gap-2"}>
                {visibleSocials.map(({ key, label, icon: Icon }) => (
                  <a
                    key={key}
                    href={siteConfig.social[key]}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="rounded-lg border border-white/15 bg-white/[0.04] p-2.5 text-white/70 outline-none ui-transition hover:-translate-y-0.5 hover:border-accent/60 hover:bg-white/10 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <FooterNavColumn
          title="Informații legale"
          items={siteConfig.legalNavigation}
        />
      </Container>

      <div className="border-t border-white/10 bg-black/10">
        <Container className="py-3.5 text-[0.8125rem] leading-5 text-white/55">
          <p>{siteConfig.copyright.notice(new Date().getFullYear())}</p>
        </Container>
      </div>
    </footer>
  )
}
