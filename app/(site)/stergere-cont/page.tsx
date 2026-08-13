import { FormPageLayout } from "@/components/form-page-layout"
import { DeletionRequestForm } from "@/components/forms/deletion-request-form"
import { siteConfig } from "@/config/site"
import { createRomanianMetadata } from "@/lib/seo"
import { getFormSubmitAvailability } from "@/services/form-service"

export const metadata = createRomanianMetadata({
  title: "Ștergere cont",
  description:
    "Formular pentru inițierea cererii de ștergere a contului și a datelor asociate.",
  path: "/stergere-cont",
  robots: { index: false, follow: false },
})

export default function AccountDeletionPage() {
  const email = siteConfig.contact.email

  return (
    <FormPageLayout
      title="Solicitare de ștergere a contului"
      description="Formularul inițiază cererea de ștergere. Datele nu sunt șterse automat: cererea este verificată și procesată de echipa responsabilă."
      variant="editorial"
      mediaLabel="Protecția datelor"
      aside={
        <div className="rounded-[1.5rem] border border-primary/15 bg-primary-dark p-6 text-sm leading-7 text-white/75 shadow-[0_20px_60px_-40px_rgba(24,37,99,0.9)]">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Ce urmează
          </span>
          Veți fi contactat pe adresa indicată pentru confirmarea identității
          înainte de procesarea cererii.
          {email ? (
            <span className="mt-4 block">
              Pentru întrebări:{" "}
              <a
                className="font-semibold text-white underline underline-offset-4"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            </span>
          ) : null}
        </div>
      }
    >
      <DeletionRequestForm availability={getFormSubmitAvailability()} />
    </FormPageLayout>
  )
}
