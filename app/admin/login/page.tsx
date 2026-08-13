import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { LoginForm } from "@/components/admin/login-form"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: "Autentificare",
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <main className="w-full max-w-md">
        <div className="rounded-2xl border bg-background p-8 shadow-[0_18px_55px_-40px_rgba(24,37,99,0.55)]">
          <div className="flex flex-col items-center text-center">
            <Image
              src={siteConfig.logo}
              alt={`Sigla ${siteConfig.name}`}
              width={56}
              height={56}
              priority
              className="h-14 w-14 object-contain"
            />
            <h1 className="mt-5 font-heading text-xl font-bold tracking-tight">
              Panou de administrare
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {siteConfig.name}
            </p>
          </div>

          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="rounded-md font-medium outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Înapoi la website
          </Link>
        </p>
      </main>
    </div>
  )
}
