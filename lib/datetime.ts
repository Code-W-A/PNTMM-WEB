/** Conversii între ISO și valoarea așteptată de `input[type=datetime-local]`. */
export function toDateTimeLocal(iso?: string): string {
  if (!iso) return ""

  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""

  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export function fromDateTimeLocal(value: string): string {
  if (!value) return ""

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString()
}

const dateTimeFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—"

  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date)
}

/** Variantă fără oră, pentru coloanele de tabel. */
export function formatDate(iso?: string | null): string {
  if (!iso) return "—"

  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date)
}
