"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"

import {
  AdminFormFeedback,
  useAdminAction,
} from "@/components/admin/admin-form-state"
import { FormField } from "@/components/forms/form-elements"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  notificationInputSchema,
  type NotificationInput,
} from "@/lib/validation/admin"

const TITLE_LIMIT = 120
const BODY_LIMIT = 500

export function NotificationForm() {
  const router = useRouter()
  const { state, run } = useAdminAction()
  const [pending, setPending] = useState<NotificationInput | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NotificationInput>({
    resolver: zodResolver(notificationInputSchema),
    defaultValues: { title: "", body: "" },
    shouldFocusError: true,
  })

  const title = watch("title") ?? ""
  const body = watch("body") ?? ""

  async function send(values: NotificationInput) {
    const succeeded = await run(
      () =>
        fetch("/api/admin/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }),
      "Notificarea a fost trimisă.",
    )

    setPending(null)

    if (succeeded) {
      reset({ title: "", body: "" })
      router.refresh()
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit((values) => setPending(values))}
        className="space-y-6"
        noValidate
      >
        <FormField name="title" label="Titlu" error={errors.title}>
          <Input maxLength={TITLE_LIMIT} {...register("title")} />
        </FormField>
        <CharacterCount value={title.length} limit={TITLE_LIMIT} />

        <FormField name="body" label="Mesaj" error={errors.body}>
          <Textarea rows={4} maxLength={BODY_LIMIT} {...register("body")} />
        </FormField>
        <CharacterCount value={body.length} limit={BODY_LIMIT} />

        <AdminFormFeedback state={state} />

        <Button type="submit" disabled={state.kind === "saving"}>
          <Send aria-hidden="true" />
          {state.kind === "saving" ? "Se trimite..." : "Trimite notificarea"}
        </Button>
      </form>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trimiți această notificare?</AlertDialogTitle>
            <AlertDialogDescription>
              Notificarea ajunge la toți utilizatorii care au permis primirea
              lor și nu poate fi retrasă după trimitere.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pending) void send(pending)
              }}
            >
              Trimite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function CharacterCount({ value, limit }: { value: number; limit: number }) {
  return (
    <p className="-mt-4 text-right text-xs tabular-nums text-muted-foreground">
      {value} / {limit}
    </p>
  )
}
