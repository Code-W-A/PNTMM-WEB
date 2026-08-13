/**
 * Constante de sesiune fără dependențe de Admin SDK, ca middleware-ul
 * (runtime Edge) să le poată importa fără a încărca `firebase-admin`.
 */
export const SESSION_COOKIE_NAME = "pntmm_session"

/** Firebase acceptă maximum 14 zile pentru un session cookie. */
export const SESSION_MAX_AGE_SECONDS = 5 * 24 * 60 * 60
