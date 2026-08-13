import Footer from "@/components/footer"
import Header from "@/components/header"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <a
        href="#continut-principal"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-accent px-4 py-2 font-bold text-accent-foreground shadow-lg transition-transform focus:translate-y-0"
      >
        Sari la conținut
      </a>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main id="continut-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}
