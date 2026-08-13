import type { LegalDocumentContent } from "@/data/legal-content"

/**
 * Randează un document juridic structurat. Cât timp documentul lipsește,
 * pagina anunță explicit acest lucru — nu se improvizează conținut juridic.
 */
export function LegalDocument({
  content,
  missingTitle,
  missingMessage,
}: {
  content?: LegalDocumentContent
  missingTitle: string
  missingMessage: string
}) {
  if (!content || content.sections.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/40 p-6">
        <p className="font-medium">{missingTitle}</p>
        <p className="mt-2 leading-7 text-muted-foreground">{missingMessage}</p>
      </div>
    )
  }

  return (
    <article className="text-foreground/90">
      {content.draftNotice ? (
        <p className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-5 text-sm leading-7">
          {content.draftNotice}
        </p>
      ) : null}

      <p className="meta mt-6 text-muted-foreground/75">
        Ultima actualizare: {content.updatedAt}
      </p>

      <div className="mt-4 space-y-4 leading-8">
        {content.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 space-y-10">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl font-bold tracking-tight">
              {section.title}
            </h2>
            <div className="mt-3 space-y-4 leading-8">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.items ? (
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span
                      aria-hidden="true"
                      className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  )
}
