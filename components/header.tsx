"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Menu } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export default function Header() {
  const pathname = usePathname()
  const currentPath = pathname ?? "/"
  const [scrolled, setScrolled] = useState(false)
  const navigationItems = siteConfig.mainNavigation.filter(
    (item) => item.href !== siteConfig.action.href,
  )

  const isActive = (href: string) =>
    href === "/" ? currentPath === href : currentPath.startsWith(href)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b text-white backdrop-blur-xl ui-transition",
        scrolled
          ? "border-white/15 bg-primary-dark/97 shadow-[0_14px_36px_-28px_rgba(5,10,35,0.95)] supports-[backdrop-filter]:bg-primary-dark/92"
          : "border-white/10 bg-primary-dark/92 shadow-[0_12px_32px_-28px_rgba(5,10,35,0.75)] supports-[backdrop-filter]:bg-primary-dark/86",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent"
      />
      <Container className="flex min-h-[5.25rem] items-center justify-between gap-5 py-2.5 sm:gap-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-dark"
          aria-label={`${siteConfig.name} — pagina principală`}
        >
          <span className="overflow-hidden rounded-xl shadow-lg shadow-black/20 ui-transition group-hover:-translate-y-0.5">
            <Image
              src={siteConfig.logo}
              alt={`Sigla ${siteConfig.name}`}
              width={500}
              height={500}
              className="h-[3.25rem] w-[3.25rem] shrink-0 object-cover sm:h-14 sm:w-14"
              priority
            />
          </span>
          <span className="hidden max-w-[11.5rem] font-heading text-sm font-bold leading-5 text-white xl:block">
            {siteConfig.fullName}
          </span>
        </Link>

        <nav aria-label="Navigație principală" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "group relative block min-h-11 overflow-hidden rounded-lg border px-4 py-2.5 text-sm font-semibold outline-none ui-transition focus-visible:ring-2 focus-visible:ring-accent",
                    isActive(item.href)
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-transparent text-white/75 hover:bg-white/[0.06] hover:text-white",
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="pn-nav-indicator absolute inset-x-4 bottom-1.5 h-0.5 bg-accent ui-transition"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            variant="accent"
            className="hidden sm:inline-flex"
          >
            <Link href={siteConfig.action.href}>
              {siteConfig.action.label}
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="secondaryOutline"
                size="icon"
                className="lg:hidden"
                aria-label="Deschide meniul"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent className="isolate w-[92vw] max-w-md overflow-hidden border-l border-white/10 bg-[linear-gradient(155deg,hsl(var(--primary))_0%,hsl(228_61%_24%)_72%,#0b112f_100%)] p-0 text-white [&>button]:text-white [&>button]:ring-offset-primary-dark">
              <div
                aria-hidden="true"
                className="absolute -right-20 top-20 -z-10 h-64 w-64 rotate-45 border border-accent/10"
              />
              <SheetHeader className="border-b border-white/10 px-6 pb-6 pt-8 pr-12 text-left">
                <span className="mb-3 inline-block overflow-hidden rounded-lg shadow-md shadow-black/20">
                  <Image
                    src={siteConfig.logo}
                    alt=""
                    width={500}
                    height={500}
                    className="h-12 w-12 object-cover"
                  />
                </span>
                <SheetTitle className="font-heading text-xl text-white">
                  {siteConfig.name}
                </SheetTitle>
                {siteConfig.fullName !== siteConfig.name ? (
                  <SheetDescription className="text-white/60">
                    {siteConfig.fullName}
                  </SheetDescription>
                ) : null}
              </SheetHeader>
              <nav aria-label="Navigație mobilă" className="px-6 py-8">
                <ul className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          aria-current={isActive(item.href) ? "page" : undefined}
                          className={cn(
                            "group flex min-h-14 items-center justify-between rounded-xl border px-4 py-3.5 font-heading text-lg font-bold outline-none ui-transition focus-visible:ring-2 focus-visible:ring-accent",
                            isActive(item.href)
                              ? "border-accent/40 bg-accent/10 text-white"
                              : "border-white/[0.06] text-white/75 hover:border-white/20 hover:bg-white/[0.06] hover:text-white",
                          )}
                        >
                          <span>
                            <span className="mr-3 font-sans text-[0.7rem] font-bold tracking-[0.16em] text-accent/80">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {item.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-accent ui-transition group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
                <SheetClose asChild>
                  <Button
                    asChild
                    variant="accent"
                    size="lg"
                    className="mt-7 w-full"
                  >
                    <Link href={siteConfig.action.href}>
                      {siteConfig.action.label}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  )
}
