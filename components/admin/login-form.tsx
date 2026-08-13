"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { FormField } from "@/components/forms/form-elements"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getFirebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client"

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Introduceți adresa de email.")
    .email("Introduceți o adresă de email validă."),
  password: z.string().min(1, "Introduceți parola."),
})

type LoginValues = z.infer<typeof schema>

const GENERIC_ERROR = "Autentificare eșuată. Verificați datele introduse."
const UNAVAILABLE_ERROR =
  "Autentificarea nu este disponibilă momentan. Încercați din nou mai târziu."

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
  })

  async function onSubmit(values: LoginValues) {
    setError(null)

    if (!isFirebaseClientConfigured()) {
      // Detaliile de configurare rămân în loguri, nu pe ecranul de login.
      console.error("[auth] configurația clientului lipsește")
      setError(UNAVAILABLE_ERROR)
      return
    }

    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        values.email,
        values.password,
      )

      // Sesiunea web este un cookie HttpOnly emis de server după verificarea
      // ID token-ului și a drepturilor de administrare.
      const idToken = await credential.user.getIdToken()
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        await getFirebaseAuth().signOut()
        setError(body?.error?.message ?? GENERIC_ERROR)
        return
      }

      const redirectTo = searchParams.get("redirect") ?? "/admin"
      router.replace(redirectTo.startsWith("/admin") ? redirectTo : "/admin")
      router.refresh()
    } catch {
      setError(GENERIC_ERROR)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FormField name="email" label="Email" error={errors.email}>
        <Input type="email" autoComplete="email" {...register("email")} />
      </FormField>
      <FormField name="password" label="Parolă" error={errors.password}>
        <Input
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
      </FormField>

      <div aria-live="polite" aria-atomic="true">
        {error ? (
          <p
            className="mb-4 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Se autentifică...
            </>
          ) : (
            "Autentificare"
          )}
        </Button>
      </div>
    </form>
  )
}
