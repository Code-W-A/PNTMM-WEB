"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function logout() {
    setPending(true)

    try {
      await fetch("/api/auth/session", { method: "DELETE" })
    } finally {
      router.replace("/admin/login")
      router.refresh()
    }
  }

  if (iconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={logout}
            disabled={pending}
            aria-label={pending ? "Se deconectează..." : "Deconectare"}
            className="size-9 text-muted-foreground hover:bg-primary/[0.07] hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Deconectare</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={logout}
      disabled={pending}
      className="h-auto w-full justify-start gap-3 px-3 py-2 font-medium text-muted-foreground hover:bg-primary/[0.07] hover:text-foreground"
    >
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {pending ? "Se deconectează..." : "Deconectare"}
    </Button>
  )
}
