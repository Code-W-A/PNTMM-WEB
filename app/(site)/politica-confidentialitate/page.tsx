import { FormPageLayout } from "@/components/form-page-layout"
import { LegalDocument } from "@/components/legal/legal-document"
import { privacyPolicy } from "@/data/legal-content"
import { createRomanianMetadata } from "@/lib/seo"

export const metadata = createRomanianMetadata({
  title: "Politica de confidențialitate",
  description:
    "Ce date personale colectăm prin formularele website-ului, în ce scop, cine are acces la ele și ce drepturi aveți asupra lor.",
  path: "/politica-confidentialitate",
})

export const revalidate = 300

export default function PrivacyPolicyPage() {
  return (
    <FormPageLayout
      title="Politica de confidențialitate"
      description="Informații despre modul în care sunt prelucrate datele transmise prin website."
    >
      <LegalDocument
        content={privacyPolicy}
        missingTitle="Document nepublicat"
        missingMessage="Politica de confidențialitate va fi publicată aici după verificarea și aprobarea documentului."
      />
    </FormPageLayout>
  )
}
