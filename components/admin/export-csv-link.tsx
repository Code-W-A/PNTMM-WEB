import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

/**
 * Descărcare de fișier, nu navigare între pagini: folosim un `<a>` obișnuit,
 * pentru ca browserul să primească răspunsul cu `Content-Disposition`.
 */
export function ExportCsvLink({
  dataset,
  eventId,
  label = "Export CSV",
}: {
  dataset: string
  eventId?: string
  label?: string
}) {
  const href = eventId
    ? `/api/admin/export/${dataset}?eventId=${encodeURIComponent(eventId)}`
    : `/api/admin/export/${dataset}`

  return (
    <Button asChild variant="outline">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href={href} download>
        <Download aria-hidden="true" />
        {label}
      </a>
    </Button>
  )
}
