import type { MetadataRoute } from "next"

import { siteConfig } from "@/config/site"

/**
 * Manifest minimal, construit din iconițele deja prezente în `public/sigla`.
 * Site-ul nu este o aplicație instalabilă; manifestul servește pentru titlul și
 * iconița corectă atunci când pagina este adăugată pe ecranul principal.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.fullName} — Partidul Național Țărănesc Maniu-Mihalache`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    lang: "ro",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#24378f",
    icons: [
      {
        src: "/sigla/android-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/sigla/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/sigla/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  }
}
