import Link from "next/link"
import type { ReactNode } from "react"

import { Container } from "@/components/layout/container"
import { PageHero } from "@/components/shared/page-hero"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function FormPageLayout({
  title,
  description,
  children,
  aside,
  variant = "legal",
  mediaLabel,
}: {
  title: string
  description: string
  children: ReactNode
  aside?: ReactNode
  variant?: "editorial" | "legal"
  mediaLabel?: string
}) {
  if (variant === "editorial") {
    return (
      <>
        <PageHero
          title={title}
          description={description}
          currentLabel={title}
          eyebrow="Dialog deschis"
          mediaLabel={mediaLabel ?? "Spațiu pentru dialog"}
        />
        <section className="relative py-12 sm:py-16 lg:py-20">
          <Container>
            <div
              className={
                aside
                  ? "grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(17rem,0.8fr)] lg:items-start"
                  : "mx-auto max-w-4xl"
              }
            >
              <div className="min-w-0 rounded-[1.75rem] border bg-card p-5 shadow-[0_24px_80px_-50px_rgba(24,37,99,0.8)] sm:p-8 lg:p-10">
                {children}
              </div>
              {aside ? (
                <aside className="min-w-0 space-y-4 lg:sticky lg:top-28">{aside}</aside>
              ) : null}
            </div>
          </Container>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="border-b bg-muted/40 py-12 sm:py-16">
        <Container>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Acasă</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="mt-8 font-heading text-4xl font-bold sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            {description}
          </p>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container>
          <div className={aside ? "grid min-w-0 gap-10 lg:grid-cols-[2fr_1fr]" : ""}>
            <div className="min-w-0 rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
              {children}
            </div>
            {aside ? <aside className="space-y-4">{aside}</aside> : null}
          </div>
        </Container>
      </section>
    </>
  )
}
