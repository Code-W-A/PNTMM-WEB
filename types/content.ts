export type ContentStatus = "draft" | "published"

/** Distinge conținut DEMO de dezvoltare față de conținut validat pentru producție. */
export type ContentSource = "demo" | "validated"

export interface NewsItem {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  imageUrl?: string
  publishedAt: string
  category: string
  status: ContentStatus
}

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  imageUrl?: string
  startDate: string
  /** Opțional: multe evenimente au doar oră de început. */
  endDate?: string
  location: string
  address?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  registrationEnabled: boolean
  status: ContentStatus
}

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  description?: string
  startedAt?: string
  completedAt?: string
  image?: {
    src: string
    alt: string
  }
  status: "planned" | "active" | "completed"
}

export interface TeamMember {
  id: string
  name: string
  role: string
  biography?: string
  image?: {
    src: string
    alt: string
  }
  email?: string
  publicLink?: string
  order?: number
  social?: {
    facebook?: string
    linkedin?: string
  }
}

export interface DemoImageRef {
  src: string
  alt: string
  isDemo: true
}

export interface AboutMission {
  eyebrow: string
  title: string
  statement: string
  supportingText?: string
  imageUrl?: string | null
  imageAlt?: string
  isDemo?: boolean
}

export interface AboutValue {
  id: string
  title: string
  description: string
  order: number
  icon?: string
}

export interface DirectionItem {
  id: string
  title: string
  description: string
  order: number
  icon?: string
  imageUrl?: string | null
  isDemo?: boolean
}

export interface OrganizationUnit {
  id: string
  title: string
  description: string
  parentId?: string | null
  order: number
  isDemo?: boolean
}

export interface AboutMilestone {
  id: string
  date?: string
  year?: string
  title: string
  description: string
  order: number
  imageUrl?: string | null
}

export interface AboutWhoWeAre {
  eyebrow: string
  title: string
  paragraphs: string[]
  imageUrl?: string | null
  imageAlt?: string
  isDemo?: boolean
}

export interface CommunityItem {
  id: string
  imageUrl: string
  alt: string
  caption?: string
  href?: string
  date?: string
  order: number
  isDemo: boolean
}

export interface AboutDocument {
  id: string
  title: string
  href: string
  description?: string
  order: number
}

/** @deprecated Folosit doar pentru compatibilitate; preferă AboutMission + AboutValue. */
export interface AboutPillar {
  id: string
  title: string
  body: string
  order: number
}

export interface AboutPageContent {
  contentSource: ContentSource
  hero: {
    title: string
    description: string
    eyebrow: string
    currentLabel: string
    mediaLabel: string
    mediaAlt: string
    imageUrl?: string | null
    isDemo?: boolean
  }
  whoWeAre: AboutWhoWeAre
  mission: AboutMission
  values: AboutValue[]
  directionsIntro: string
  directions: DirectionItem[]
  /** Atribuirea sursei pentru textele doctrinare preluate din documentele publice. */
  sourceNote?: {
    text: string
    linkLabel: string
    href: string
  }
  organizationUnits: OrganizationUnit[]
  milestones: AboutMilestone[]
  teamIntro: string
  team: TeamMember[]
  communityIntro: string
  communityItems: CommunityItem[]
  documents: AboutDocument[]
  cta: {
    title: string
    description: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
  }
}
