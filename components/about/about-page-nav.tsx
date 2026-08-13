"use client"

import { useEffect, useState } from "react"

import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

export interface AboutNavItem {
  id: string
  label: string
}

interface AboutPageNavProps {
  items: AboutNavItem[]
}

export function AboutPageNav({ items }: AboutPageNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "")

  useEffect(() => {
    if (items.length === 0) return

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="Secțiuni pagină"
      className="sticky top-[5.25rem] z-40 border-b border-border/80 bg-background/92 backdrop-blur-md supports-[backdrop-filter]:bg-background/85"
    >
      <Container className="overflow-x-auto">
        <ul className="flex min-h-11 items-stretch gap-1 py-1 sm:gap-2">
          {items.map((item) => {
            const isActive = activeId === item.id
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "relative flex h-full items-center px-2.5 py-2 text-[0.8125rem] font-semibold tracking-wide outline-none ui-transition sm:px-3 sm:text-sm",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2 bottom-0 h-0.5 origin-left bg-accent ui-transition",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </Container>
    </nav>
  )
}
