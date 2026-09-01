/**
 * Numele colecțiilor Firestore. Folosite atât de codul server, cât și de
 * regulile de securitate — orice redenumire trebuie făcută în ambele locuri.
 */
export const COLLECTIONS = {
  users: "users",
  news: "news",
  events: "events",
  eventRegistrations: "eventRegistrations",
  reports: "reports",
  proposals: "proposals",
  contactMessages: "contactMessages",
  interestSubmissions: "interestSubmissions",
  deletionRequests: "deletionRequests",
  notifications: "notifications",
  pushTokens: "pushTokens",
  adminActions: "adminActions",
} as const

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]
