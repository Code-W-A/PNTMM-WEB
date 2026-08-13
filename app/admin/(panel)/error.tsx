"use client"

import { useEffect } from "react"

import { ErrorState } from "@/components/admin/ui/error-state"
import { AdminPageHeader } from "@/components/admin/ui/page-header"

export default function AdminPanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Detaliile rămân în loguri; utilizatorul vede doar un mesaj scurt.
    console.error("[admin] randarea paginii a eșuat", error)
  }, [error])

  return (
    <>
      <AdminPageHeader title="Administrare" />
      <ErrorState onRetry={reset} />
    </>
  )
}
