import { FormPageLayout } from "@/components/form-page-layout"
import { ReportForm } from "@/components/forms/report-form"
import { createRomanianMetadata } from "@/lib/seo"
import { getFormSubmitAvailability } from "@/services/form-service"

export const metadata = createRomanianMetadata({
  title: "Sesizări",
  description: "Canal privat pentru transmiterea sesizărilor către PNȚMM Cluj.",
  path: "/sesizari",
  robots: { index: false, follow: false },
})

export default function ReportsPage() {
  return (
    <FormPageLayout
      title="Trimiteți o sesizare"
      description="Sesizările sunt transmise printr-un canal privat. Datele nu sunt publicate și sunt accesibile exclusiv persoanelor autorizate."
      variant="editorial"
      mediaLabel="Canal privat de dialog"
      aside={
        <div className="rounded-[1.5rem] border border-primary/15 bg-primary-dark p-6 text-sm leading-7 text-white/75 shadow-[0_20px_60px_-40px_rgba(24,37,99,0.9)]">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Confidențialitate
          </span>
          Nu includeți parole, date bancare sau alte informații sensibile care
          nu sunt necesare descrierii sesizării.
        </div>
      }
    >
      <ReportForm availability={getFormSubmitAvailability()} />
    </FormPageLayout>
  )
}
