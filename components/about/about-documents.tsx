import Link from "next/link"
import { ArrowUpRight, FileText } from "lucide-react"

import { Container } from "@/components/layout/container"
import type { AboutDocument } from "@/types"

interface AboutDocumentsProps {
  documents: AboutDocument[]
}

export function AboutDocuments({ documents }: AboutDocumentsProps) {
  if (documents.length === 0) return null

  const items = [...documents].sort((a, b) => a.order - b.order)

  return (
    <section
      aria-labelledby="documente-title"
      className="section-padding overflow-hidden border-t"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow text-primary">Transparență</p>
          <h2
            id="documente-title"
            className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Documente și informații
          </h2>
        </div>
        <ul className="mt-10 divide-y border-y">
          {items.map((doc) => (
            <li key={doc.id}>
              <Link
                href={doc.href}
                className="group flex min-h-16 items-center justify-between gap-4 py-5 outline-none ui-transition hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring sm:px-2"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <FileText
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                  />
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">
                      {doc.title}
                    </span>
                    {doc.description ? (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {doc.description}
                      </span>
                    ) : null}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-primary ui-transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
