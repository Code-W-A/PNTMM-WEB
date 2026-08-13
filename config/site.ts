export interface SiteContact {
  email?: string
  phone?: string
  address?: string
  /**
   * Eticheta adresei. Pe site-ul unei organizații județene adresa poate fi a
   * sediului central, iar eticheta trebuie să spună asta explicit.
   */
  addressLabel?: string
  /** Program de lucru / orar — afișat doar dacă este definit. */
  hours?: string
}

export interface SiteSocial {
  facebook?: string
  instagram?: string
  youtube?: string
  linkedin?: string
}

export interface NavigationItem {
  label: string
  href: string
}

export interface FooterNavColumn {
  title: string
  items: NavigationItem[]
}

export interface SiteConfig {
  name: string
  fullName: string
  description: string
  domain?: string
  logo: string
  copyright: {
    owner: string
    notice: (year: number) => string
  }
  contact: SiteContact
  social: SiteSocial
  mainNavigation: NavigationItem[]
  footerNavigation: FooterNavColumn[]
  action: NavigationItem
  legalNavigation: NavigationItem[]
}

export const siteConfig: SiteConfig = {
  name: "PNȚMM Cluj",
  fullName: "PNȚMM Cluj",
  description:
    "Organizația Cluj a Partidului Național Țărănesc Maniu-Mihalache: doctrină creștin-democrată, știri, evenimente și modalități de implicare.",
  // Configurați NEXT_PUBLIC_SITE_URL cu domeniul oficial înainte de lansare.
  domain: process.env.NEXT_PUBLIC_SITE_URL,
  logo: "/sigla/logo-pnt.webp",
  copyright: {
    owner: "PNȚMM Cluj",
    notice: (year) => `© ${year} PNȚMM Cluj. Toate drepturile rezervate.`,
  },
  /**
   * Date preluate din secțiunea Contact a site-ului oficial https://pntmm.ro.
   * Sunt ale sediului central; când filiala Cluj comunică date proprii, ele le
   * înlocuiesc aici, în singurul loc din care se alimentează footerul, pagina
   * de contact și pagina de ștergere a contului.
   */
  contact: {
    email: "contact@pntmm.ro",
    phone: "+40 727 374 129",
    address:
      "Calea Victoriei nr. 155, Bl. D1, Tronson VI (Sc. VI), Et. II, București",
    addressLabel: "Sediu central",
    hours: "Luni–Vineri, 09:00–16:00",
  },
  // Se completează cu adresele exacte ale paginilor oficiale, după confirmare.
  social: {
    facebook: undefined,
    instagram: undefined,
    youtube: undefined,
    linkedin: undefined,
  },
  mainNavigation: [
    { label: "Acasă", href: "/" },
    { label: "Despre noi", href: "/despre-noi" },
    { label: "Știri", href: "/stiri" },
    { label: "Evenimente", href: "/evenimente" },
    { label: "Implică-te", href: "/implica-te" },
    { label: "Contact", href: "/contact" },
  ],
  footerNavigation: [
    {
      title: "Navigație",
      items: [
        { label: "Acasă", href: "/" },
        { label: "Despre noi", href: "/despre-noi" },
        { label: "Știri", href: "/stiri" },
        { label: "Evenimente", href: "/evenimente" },
      ],
    },
    {
      title: "Participă",
      items: [
        { label: "Implică-te", href: "/implica-te" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  action: {
    label: "Implică-te",
    href: "/implica-te",
  },
  legalNavigation: [
    {
      label: "Politica de confidențialitate",
      href: "/politica-confidentialitate",
    },
    { label: "Termeni și condiții", href: "/termeni-si-conditii" },
    { label: "Ștergere cont/date", href: "/stergere-cont" },
  ],
}
