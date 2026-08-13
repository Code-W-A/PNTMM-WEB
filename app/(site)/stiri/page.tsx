import { Container } from "@/components/layout/container"
import { NewsList } from "@/components/news/news-list"
import { PageHero } from "@/components/shared/page-hero"
import { createRomanianMetadata } from "@/lib/seo"
import { getNews } from "@/services/content-service"

export const metadata = createRomanianMetadata({
  title: "Știri",
  description:
    "Știri, comunicate și materiale publicate de PNȚMM Cluj, disponibile după validare editorială.",
  path: "/stiri",
})

/** Plasă de siguranță; publicarea din panou invalidează imediat cache-ul. */
export const revalidate = 300

export default async function NewsPage() {
  const news = await getNews()

  return (
    <>
      <PageHero
        title="Știri"
        description="Aici vor fi publicate știri, comunicate și materiale validate editorial."
        currentLabel="Știri"
        eyebrow="Jurnal editorial"
        mediaLabel="Imagine ilustrativă"
      />
      <section className="py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Publicații
            </span>
          </div>
          <NewsList items={news} />
        </Container>
      </section>
    </>
  )
}
