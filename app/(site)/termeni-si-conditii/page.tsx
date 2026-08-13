import { FormPageLayout } from "@/components/form-page-layout"
import { LegalDocument } from "@/components/legal/legal-document"
import { termsAndConditions } from "@/data/legal-content"
import { createRomanianMetadata } from "@/lib/seo"

export const metadata = createRomanianMetadata({
  title: "Termeni și condiții",
  description:
    "Condițiile în care puteți folosi website-ul organizației și formularele de contact, sesizări, propuneri și înscriere.",
  path: "/termeni-si-conditii",
})

export const revalidate = 300

export default function TermsPage() {
  return (
    <FormPageLayout
      title="Termeni și condiții"
      description="Condițiile de utilizare a website-ului și a formularelor disponibile."
    >
      <LegalDocument
        content={termsAndConditions}
        missingTitle="Document nepublicat"
        missingMessage="Termenii și condițiile vor fi publicate aici după verificarea și aprobarea documentului."
      />
    </FormPageLayout>
  )
}
