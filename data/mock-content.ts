import type { Event, NewsItem, Project, TeamMember } from "@/types"

/**
 * Date fictive pentru dezvoltare și demonstrație.
 * Nu reprezintă persoane, evenimente sau poziții oficiale PNTMM.
 * Imaginile din /public/demo sunt stoc Unsplash, folosite doar ca exemple vizuale.
 */
export const mockNews: NewsItem[] = [
  {
    id: "news-demo-1",
    slug: "dialog-pentru-comunitati-puternice",
    title: "[EXEMPLU] Dialog pentru comunități puternice",
    excerpt:
      "O inițiativă demonstrativă despre consultarea comunităților locale.",
    content:
      "Acesta este conținut fictiv, folosit exclusiv pentru dezvoltarea interfeței.",
    imageUrl: "/demo/news-01.jpg",
    publishedAt: "2026-05-18T09:00:00.000Z",
    category: "Comunități",
    status: "published",
  },
  {
    id: "news-demo-2",
    slug: "prioritati-pentru-administratie-responsabila",
    title: "[EXEMPLU] Priorități pentru o administrație responsabilă",
    excerpt:
      "Exemplu de știre despre transparență și responsabilitate publică.",
    content:
      "Acesta este conținut fictiv, folosit exclusiv pentru dezvoltarea interfeței.",
    imageUrl: "/demo/news-02.jpg",
    publishedAt: "2026-04-09T12:00:00.000Z",
    category: "Administrație",
    status: "published",
  },
  {
    id: "news-demo-3",
    slug: "consultare-publica-model-editorial",
    title: "[EXEMPLU] Consultare publică — model editorial",
    excerpt:
      "Material fictiv folosit pentru a demonstra prezentarea unei consultări.",
    content:
      "Acesta este un text fictiv. Conținutul editorial oficial urmează să fie furnizat și verificat înainte de publicare.",
    imageUrl: "/demo/news-03.jpg",
    publishedAt: "2026-03-12T10:00:00.000Z",
    category: "Consultare",
    status: "published",
  },
  {
    id: "news-demo-4",
    slug: "agenda-civica-model-editorial",
    title: "[EXEMPLU] Agendă civică — model editorial",
    excerpt:
      "Exemplu fictiv pentru testarea unei știri despre participare civică.",
    content:
      "Acesta este un text fictiv, fără referire la acțiuni sau poziții oficiale. Va fi înlocuit cu informație editorială validată.",
    imageUrl: "/demo/news-04.jpg",
    publishedAt: "2026-02-20T08:30:00.000Z",
    category: "Civic",
    status: "published",
  },
]

export const mockEvents: Event[] = [
  {
    id: "event-demo-1",
    slug: "dezbatere-despre-viitorul-comunitatilor",
    title: "[EXEMPLU] Dezbatere despre viitorul comunităților",
    description:
      "Eveniment fictiv creat pentru testarea listărilor și detaliilor.",
    imageUrl: "/demo/event-01.jpg",
    startDate: "2026-10-15T15:00:00.000Z",
    endDate: "2026-10-15T17:00:00.000Z",
    location: "Spațiu demonstrativ",
    address: "Adresă fictivă — de înlocuit",
    registrationEnabled: false,
    status: "published",
  },
  {
    id: "event-demo-2",
    slug: "atelier-de-participare-civica",
    title: "[EXEMPLU] Atelier de participare civică",
    description:
      "Eveniment fictiv pentru demonstrarea calendarului editorial. Detaliile nu reprezintă un anunț public.",
    imageUrl: "/demo/event-02.jpg",
    startDate: "2026-11-05T16:00:00.000Z",
    endDate: "2026-11-05T18:00:00.000Z",
    location: "Spațiu demonstrativ",
    address: "Adresă fictivă — de înlocuit",
    registrationEnabled: false,
    status: "published",
  },
  {
    id: "event-demo-3",
    slug: "intalnire-comunitara-model",
    title: "[EXEMPLU] Întâlnire comunitară — model",
    description:
      "Înregistrare fictivă destinată exclusiv testării paginii de evenimente.",
    imageUrl: "/demo/event-03.jpg",
    startDate: "2026-12-03T16:30:00.000Z",
    endDate: "2026-12-03T18:30:00.000Z",
    location: "Locație demonstrativă",
    address: "Adresă fictivă — de înlocuit",
    registrationEnabled: false,
    status: "published",
  },
  {
    id: "event-demo-4",
    slug: "arhiva-eveniment-model",
    title: "[EXEMPLU] Eveniment încheiat — model de arhivă",
    description:
      "Înregistrare fictivă folosită pentru verificarea secțiunii de evenimente trecute.",
    imageUrl: "/demo/event-04.jpg",
    startDate: "2026-01-20T16:30:00.000Z",
    endDate: "2026-01-20T18:00:00.000Z",
    location: "Locație demonstrativă",
    address: "Adresă fictivă — de înlocuit",
    registrationEnabled: false,
    status: "published",
  },
]

export const mockProjects: Project[] = [
  {
    id: "project-demo-1",
    slug: "comunitati-care-conteaza",
    title: "Comunități care contează",
    summary:
      "Proiect fictiv pentru prezentarea inițiativelor la nivel local.",
    image: {
      src: "/demo/project-01.jpg",
      alt: "Imagine demonstrativă — comunitate (Unsplash)",
    },
    status: "active",
  },
  {
    id: "project-demo-2",
    slug: "dialog-deschis",
    title: "Dialog deschis",
    summary:
      "Proiect fictiv care ilustrează spațiul de consultare și participare.",
    image: {
      src: "/demo/project-02.jpg",
      alt: "Imagine demonstrativă — dialog (Unsplash)",
    },
    status: "active",
  },
  {
    id: "project-demo-3",
    slug: "initiativa-locala",
    title: "Inițiativă locală",
    summary:
      "Proiect fictiv pentru mosaic-ul de pe homepage; conținutul oficial urmează.",
    image: {
      src: "/demo/project-03.jpg",
      alt: "Imagine demonstrativă — inițiativă (Unsplash)",
    },
    status: "planned",
  },
]

// Intenționat gol: persoanele nu trebuie inventate.
export const mockTeam: TeamMember[] = []
