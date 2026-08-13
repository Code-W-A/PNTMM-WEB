/**
 * Copy editorial pentru /implica-te.
 * Formular de interes — nu reprezintă aderare automată.
 */
export const involvePageContent = {
  hero: {
    title: "Implică-te",
    eyebrow: "Participare",
    currentLabel: "Implică-te",
    description:
      "Dacă doriți să ne transmiteți interesul dumneavoastră, completați formularul. Datele sunt folosite doar pentru a răspunde mesajului.",
    mediaLabel: "Imagine ilustrativă",
    mediaAlt: "Imagine demonstrativă — oameni care colaborează într-un cadru comunitar",
    imageUrl: "/demo/hero-comunitate.jpg",
    isDemo: true as const,
  },
  intro: {
    eyebrow: "Formular de interes",
    title: "Spuneți-ne cum doriți să vă implicați",
    description:
      "Completați câteva date de contact și o scurtă descriere. Formularul exprimă interesul de implicare și nu reprezintă automat un act de aderare.",
    steps: [
      { order: 1, label: "Completați formularul de interes" },
      { order: 2, label: "Lăsați datele necesare pentru răspuns" },
      { order: 3, label: "Transmiterea nu reprezintă aderare automată" },
    ],
  },
  panel: {
    eyebrow: "Implicare",
    title: "Primul pas este să ne spuneți ce vă interesează",
    description:
      "Completați formularul din dreapta. Informațiile ne ajută să înțelegem cum doriți să contribuiți.",
    points: [
      { order: 1, label: "Completați formularul" },
      { order: 2, label: "Spuneți-ne cum doriți să contribuiți" },
      { order: 3, label: "Transmiterea exprimă interesul" },
    ],
    disclaimer:
      "Formularul exprimă interesul de implicare și nu reprezintă automat aderarea.",
  },
  form: {
    eyebrow: "Date de contact",
    title: "Formular de interes",
    supportingText: "Câmpurile marcate sunt necesare pentru a vă putea răspunde.",
    messageHint: "Descrieți pe scurt în ce mod doriți să contribuiți.",
    localityRequired: true,
    developmentNotice:
      "Formularul este în curs de configurare. Vă rugăm să reveniți mai târziu.",
    successTitle: "Formular transmis",
    successMessage:
      "Mesajul dumneavoastră a fost înregistrat. Vă mulțumim pentru interes.",
    unavailableMessage:
      "Trimiterea formularului nu este disponibilă momentan. Vă rugăm să reveniți mai târziu.",
    /** Pregătit pentru opțiuni viitoare — gol = nu se afișează. */
    involvementOptions: [] as ReadonlyArray<{ id: string; label: string }>,
  },
  secondaryCta: {
    text: "Aveți doar o întrebare?",
    linkLabel: "Contactați-ne",
    href: "/contact",
  },
} as const
