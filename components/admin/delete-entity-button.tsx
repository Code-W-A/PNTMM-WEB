"use client"

import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

/**
 * Ștergerea trece întotdeauna prin confirmare explicită, niciodată prin
 * `window.confirm`.
 */
export function DeleteEntityButton({
  endpoint,
  redirectTo,
  title,
  successMessage,
  iconOnly = false,
}: {
  endpoint: string
  /** Absent în liste: rândul dispare printr-un refresh, fără navigare. */
  redirectTo?: string
  title: string
  successMessage: string
  iconOnly?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [pending, setPending] = useState(false)

  async function remove() {
    setPending(true)

    try {
      const response = await fetch(endpoint, { method: "DELETE" })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        toast({
          variant: "destructive",
          title: body?.error?.message ?? "Ștergerea nu a reușit.",
        })
        return
      }

      toast({ title: successMessage })
      if (redirectTo) router.push(redirectTo)
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Conexiunea a eșuat. Încercați din nou.",
      })
    } finally {
      setPending(false)
    }
  }

  const icon = pending ? (
    <Loader2 className="animate-spin" aria-hidden="true" />
  ) : (
    <Trash2 aria-hidden="true" />
  )

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {iconOnly ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            aria-label="Șterge"
            title="Șterge"
            className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            {icon}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {icon}
            Șterge
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            onClick={remove}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Șterge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
