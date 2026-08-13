/**
 * Punte tipată către configurația partajată din `scripts/e2e-env.mjs`, ca
 * specurile să nu redefinească valori care există deja.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const config = require("../../scripts/e2e-env.cjs")

interface E2eUser {
  email: string
  password: string
  displayName: string
  admin: boolean
  disabled?: boolean
}

export const AUTH_HOST: string = config.AUTH_HOST
export const E2E_API_KEY: string = config.E2E_API_KEY
export const E2E_PROJECT_ID: string = config.E2E_PROJECT_ID
export const E2E_BASE_URL: string = config.E2E_BASE_URL

export const USERS: Record<
  "admin" | "sessionAdmin" | "nonAdmin" | "toDisable" | "disabled",
  E2eUser
> = config.E2E_USERS

export const ADMIN_STATE_FILE = "e2e/.auth/admin.json"

/** Date semănate, pentru aserțiuni care nu depind de ce creează testele. */
export const SEED = {
  publishedNews: {
    slug: "seed-stire-publicata",
    title: "Ședință publică a filialei Cluj",
  },
  draftNews: {
    slug: "seed-stire-ciorna",
    title: "Ciornă care nu trebuie să apară public",
  },
  upcomingEvent: {
    id: "seed-event-upcoming",
    slug: "seed-eveniment-viitor",
    title: "Întâlnire cu cetățenii din Mănăștur",
  },
  pastEvent: {
    slug: "seed-eveniment-trecut",
    title: "Dezbatere despre transportul public",
  },
  newReport: { subject: "Groapă pe strada Observatorului" },
  closedReport: { subject: "Iluminat public reparat în Zorilor" },
  newProposal: { title: "Piste de biciclete pe malul Someșului" },
  contactMessage: { subject: "Solicitare de informații despre filială" },
  interestSubmission: { email: "radu.chindris@exemplu.test" },
  deletionRequest: { email: "de-sters@exemplu.test" },
  registrations: [
    { name: "Participant Unu", email: "participant.unu@exemplu.test" },
    { name: "Participant Doi", email: "participant.doi@exemplu.test" },
  ],
} as const
