import "server-only"

import type { z } from "zod"

import { ApiError } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"

export interface ParsedAdminContent<T> {
  input: T
  file: File | null
  removeImage: boolean
  multipart: boolean
}

function isMultipart(request: Request) {
  return (request.headers.get("content-type") ?? "").includes(
    "multipart/form-data",
  )
}

function readCoverFile(form: FormData): File | null {
  const entries = form.getAll("image").filter((entry) => entry instanceof File)

  if (entries.length > 1) {
    throw new ApiError(
      400,
      "too_many_files",
      "Puteți atașa o singură imagine.",
    )
  }

  const file = entries[0]
  return file && file.size > 0 ? file : null
}

function formFields(form: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {}

  for (const [key, value] of form.entries()) {
    if (key === "image" || key === "removeImage") continue
    if (typeof value !== "string") continue
    raw[key] = value
  }

  if ("registrationEnabled" in raw) {
    raw.registrationEnabled = raw.registrationEnabled === "true"
  }

  return raw
}

/** JSON rămâne valid pentru E2E; formularul admin trimite multipart cu fișier. */
export async function parseAdminContentBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<ParsedAdminContent<T>> {
  if (!isMultipart(request)) {
    return {
      input: validate(schema, await parseJsonBody(request)),
      file: null,
      removeImage: false,
      multipart: false,
    }
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    throw new ApiError(400, "invalid_request", "Cerere invalidă.")
  }

  return {
    input: validate(schema, formFields(form)),
    file: readCoverFile(form),
    removeImage: form.get("removeImage") === "true",
    multipart: true,
  }
}
