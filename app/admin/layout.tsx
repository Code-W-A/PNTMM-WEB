import type { Metadata } from "next"

import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: {
    default: "Administrare",
    template: `%s | Administrare ${siteConfig.name}`,
  },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-muted/30">{children}</div>
}
