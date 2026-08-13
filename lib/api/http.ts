import { NextResponse } from "next/server"

/**
 * Erori de API cu mesaj destinat utilizatorului. Detaliile interne rămân în
 * loguri; răspunsul nu expune niciodată stack trace sau internele Firebase.
 */
export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status })
}

const GENERIC_ERROR =
  "A apărut o eroare neașteptată. Vă rugăm să încercați din nou."

/**
 * Convertește orice excepție într-un răspuns sigur. Erorile necunoscute sunt
 * logate server-side și raportate generic către client.
 */
export function handleApiError(error: unknown, context: string) {
  if (error instanceof ApiError) {
    return jsonError(error.status, error.code, error.message)
  }

  console.error(`[api] ${context}`, error)

  return jsonError(500, "internal_error", GENERIC_ERROR)
}
