import { FormPageLayout } from "@/components/form-page-layout"
import { ProposalForm } from "@/components/forms/proposal-form"
import { createRomanianMetadata } from "@/lib/seo"
import { getFormSubmitAvailability } from "@/services/form-service"

export const metadata = createRomanianMetadata({
  title: "Propuneri",
  description: "Canal privat pentru transmiterea propunerilor către PNȚMM Cluj.",
  path: "/propuneri",
  robots: { index: false, follow: false },
})

export default function ProposalsPage() {
  return (
    <FormPageLayout
      title="Trimiteți o propunere"
      description="Descrieți ideea dumneavoastră. Propunerile nu sunt publicate automat și sunt analizate de echipa organizației."
      variant="editorial"
      mediaLabel="Idei pentru comunitate"
    >
      <ProposalForm availability={getFormSubmitAvailability()} />
    </FormPageLayout>
  )
}
