import type { Metadata } from "next"
import { Merriweather, Noto_Sans } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"

import "./globals.css"

const bodyFont = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
})

const headingFont = Merriweather({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  ...(siteConfig.domain
    ? { metadataBase: new URL(siteConfig.domain) }
    : {}),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/sigla/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/sigla/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/sigla/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Imaginea de partajare vine din `app/opengraph-image.tsx`; Next o atașează
  // automat, deci `images` nu trebuie declarat aici.
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

/**
 * Layout rădăcină minimal. Cromatica site-ului public trăiește în grupul
 * `(site)`, iar panoul de administrare are propriul cadru sub `/admin`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body
        className={`${bodyFont.variable} ${headingFont.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
