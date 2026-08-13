/**
 * Copy editorial pentru /contact.
 * Datele de contact și social vin exclusiv din siteConfig — nu se inventează aici.
 */
export const contactPageContent = {
  hero: {
    title: "Contact",
    eyebrow: "Dialog deschis",
    currentLabel: "Contact",
    description:
      "Pentru o întrebare, o propunere sau o sesizare, trimiteți-ne un mesaj prin formularul disponibil.",
    mediaLabel: "Imagine ilustrativă",
    mediaAlt: "Imagine demonstrativă — discuție într-un cadru de lucru",
    imageUrl: "/demo/contact-dialog.jpg",
    isDemo: true as const,
  },
  info: {
    eyebrow: "Contact direct",
    title: "Suntem aici pentru dialog",
    intro:
      "Folosiți canalele disponibile sau trimiteți un mesaj prin formular.",
  },
  socialHeading: "Rețele sociale",
  reportCallout: {
    title: "Aveți o sesizare sau o propunere?",
    description:
      "Folosiți formularul potrivit pentru ca mesajul dumneavoastră să fie direcționat corect.",
    reportLabel: "Trimite o sesizare",
    reportHref: "/sesizari",
    proposalLabel: "Propune o idee",
    proposalHref: "/propuneri",
  },
  involveCta: {
    prefix: "Doriți să vă implicați?",
    label: "Află cum",
    href: "/implica-te",
  },
  form: {
    eyebrow: "Scrie-ne",
    title: "Trimite un mesaj",
    supportingText:
      "Completați câmpurile de mai jos. Vom folosi datele doar pentru a răspunde mesajului dumneavoastră.",
    successTitle: "Mesaj trimis",
    successMessage: "Mesajul dumneavoastră a fost înregistrat. Vă mulțumim.",
    unavailableMessage:
      "Trimiterea mesajelor nu este disponibilă momentan. Vă rugăm să reveniți mai târziu.",
    developmentNotice:
      "Formularul este în curs de configurare. Vă rugăm să reveniți mai târziu.",
  },
} as const
