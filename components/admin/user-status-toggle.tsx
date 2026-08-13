"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { useAdminAction } from "@/components/admin/admin-form-state"
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
import type { UserStatus } from "@/types"

/**
 * Dezactivarea se propagă în autentificare, nu doar în profil, astfel încât
 * contul să nu mai poată fi folosit nici din aplicațiile mobile. Fiind o
 * acțiune cu efect imediat asupra accesului, cere confirmare.
 */
export function UserStatusToggle({
  uid,
  email,
  status,
}: {
  uid: string
  email: string | null
  status: UserStatus
}) {
  const router = useRouter()
  const { state, run } = useAdminAction()

  const next: UserStatus = status === "active" ? "disabled" : "active"
  const saving = state.kind === "saving"

  async function change() {
    const succeeded = await run(
      () =>
        fetch(`/api/admin/users/${uid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        }),
      next === "disabled"
        ? "Contul a fost dezactivat."
        : "Contul a fost reactivat.",
    )

    if (succeeded) router.refresh()
  }

  if (next === "active") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={change}
        disabled={saving}
      >
        {saving ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        Reactivează
      </Button>
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={saving}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {saving ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : null}
          Dezactivează
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dezactivezi acest cont?</AlertDialogTitle>
          <AlertDialogDescription>
            {email ?? uid} nu se va mai putea autentifica, iar sesiunile active
            se închid imediat. Contul poate fi reactivat oricând.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            onClick={change}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Dezactivează
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
