import type { AboutPageContent, TeamMember } from "@/types"

import { demoImages } from "@/data/demo-images"

/**
 * Conținut pentru /despre-noi.
 *
 * Textele doctrinare urmează formulările publicate de PNȚMM pe site-ul oficial
 * (secțiunile „Cine suntem" și „Prioritățile PNȚMM" de pe https://pntmm.ro).
 * Datele locale despre organizația Cluj se publică numai după validare.
 */
export const aboutPageContent: AboutPageContent = {
  contentSource: "validated",
  hero: {
    title: "Despre PNȚMM",
    description:
      "PNȚMM își asumă tradiția național-țărănistă și o viziune creștin-democrată asupra vieții publice, întemeiată pe democrație, morală și dreptate socială.",
    eyebrow: "Identitate și direcție",
    currentLabel: "Despre noi",
    mediaLabel: "Imagine ilustrativă",
    mediaAlt: demoImages.aboutHero.alt,
    imageUrl: demoImages.aboutHero.src,
    isDemo: true,
  },
  whoWeAre: {
    eyebrow: "Prezentare",
    title: "Cine suntem",
    paragraphs: [
      "Partidul Național Țărănesc Maniu-Mihalache are la bază doctrina creștin-democrată, cu trei componente care se susțin reciproc: democrația, morala creștină și dreptatea socială — doctrina care a stat la baza civilizației europene occidentale și a constituirii Uniunii Europene.",
      "Este un partid de centru, echilibrat, pentru care dezvoltarea economică se îmbină cu distribuția echitabilă a bunăstării. Susține libera inițiativă și competiția, dar consideră persoana legată de comunitate, cu îndatoriri față de aceasta.",
      "PNȚMM se revendică drept continuatorul Partidului Național Țărănesc condus de Iuliu Maniu și Ion Mihalache și al PNȚCD condus de Corneliu Coposu. Este adept al monarhiei constituționale, considerând-o forma de guvernământ cea mai potrivită pentru dezvoltarea sănătoasă a României.",
    ],
    imageUrl: demoImages.aboutWhoWeAre.src,
    imageAlt: demoImages.aboutWhoWeAre.alt,
    isDemo: true,
  },
  mission: {
    eyebrow: "Misiune",
    title: "Misiunea noastră",
    statement:
      "Acțiunea politică a PNȚMM este orientată spre renașterea morală a României, fundament al dezvoltării ei sustenabile, și spre reîntregirea națională a țării.",
    supportingText:
      "Redresarea țării este posibilă printr-o guvernare creștin-democrată, bazată pe meritocrație și exercitată de oameni cinstiți, care să acționeze pentru binele comun într-o societate a dreptății sociale.",
    imageUrl: demoImages.aboutMission.src,
    imageAlt: demoImages.aboutMission.alt,
    isDemo: true,
  },
  values: [
    {
      id: "moralitate",
      title: "Morală creștină",
      description:
        "Omul nu poate fi despărțit de Dumnezeu, nici politica de morală. Morala creștină este reperul conduitei publice și temeiul relației dintre persoană și comunitate.",
      order: 1,
    },
    {
      id: "patriotism",
      title: "Patriotism luminat",
      description:
        "Responsabilitate față de țară, fără izolare: dezvoltarea României ca țară generatoare de valori, integrată în Uniunea Europeană și în NATO.",
      order: 2,
    },
    {
      id: "dreptate-sociala",
      title: "Dreptate socială",
      description:
        "Dezvoltarea economică însoțită de distribuția echitabilă a bunăstării, fără egalitarism și fără intervenția nejustificată a statului în economie.",
      order: 3,
    },
    {
      id: "democratie",
      title: "Democrație desăvârșită",
      description:
        "Refacerea instituțiilor democratice la toate nivelurile și o clasă politică întemeiată pe adevăr, competență și dăruire pentru binele general.",
      order: 4,
    },
  ],
  directionsIntro:
    "Prioritățile de mai jos sunt cele asumate public de PNȚMM la nivel național.",
  directions: [
    {
      id: "renastere-morala",
      title: "Renașterea morală a României",
      description:
        "Patru piloni — familia, școala, cultura și biserica — susținuți de o justiție puternică și dreaptă, toleranță zero față de corupție, meritocrație și eliminarea privilegiilor.",
      order: 1,
      imageUrl: demoImages.aboutDirections[0].src,
      isDemo: true,
    },
    {
      id: "dezvoltare-economica",
      title: "Dezvoltare economică accelerată",
      description:
        "Învățământ, cercetare și digitalizare, stimularea antreprenoriatului, dezvoltarea agriculturii și a satelor, atragerea fondurilor europene.",
      order: 2,
      imageUrl: demoImages.aboutDirections[1].src,
      isDemo: true,
    },
    {
      id: "reforma-electorala",
      title: "Reformă electorală",
      description:
        "Drept efectiv de vot pentru fiecare cetățean român, oriunde s-ar afla, vot electronic în paralel cu cel clasic și alegeri locale în două tururi.",
      order: 3,
      imageUrl: demoImages.aboutDirections[2].src,
      isDemo: true,
    },
  ],
  sourceNote: {
    text: "Valorile și prioritățile de mai sus urmează formulările publicate de partid pe site-ul oficial.",
    linkLabel: "pntmm.ro",
    href: "https://pntmm.ro",
  },
  organizationUnits: [],
  milestones: [],
  teamIntro:
    "Echipa locală va fi prezentată după confirmarea informațiilor și acordul persoanelor.",
  team: [],
  communityIntro:
    "",
  communityItems: [],
  documents: [],
  cta: {
    title: "Doriți să vă implicați?",
    description:
      "Aflați mai multe despre formularul de interes sau trimiteți-ne un mesaj.",
    primaryLabel: "Formular de interes",
    primaryHref: "/implica-te",
    secondaryLabel: "Contact",
    secondaryHref: "/contact",
  },
}

/**
 * Conducerea organizației județene Cluj — pregătită, nepublicată.
 *
 * Informația provine din presă, nu de pe un site oficial al partidului, și
 * privește persoane reale. De aceea nu este legată de `aboutPageContent.team`:
 * secțiunea „Echipa" rămâne ascunsă cât timp lista este goală.
 *
 * Pentru publicare sunt necesare, în ordine:
 *   1. confirmarea că datele sunt în continuare valabile;
 *   2. acordul persoanei pentru afișarea numelui și a funcției;
 *   3. înlocuirea `team: []` cu `team: clujBranchLeadership` în obiectul de mai sus.
 *
 * Prioritățile locale și linkul către sursa de presă se completează la pasul 1;
 * nu le formulăm noi.
 */
export const clujBranchLeadership: TeamMember[] = [
  {
    id: "romulus-luca",
    name: "Romulus Luca",
    role: "Președinte, organizația județeană Cluj",
    biography:
      "Avocat, ales președinte al organizației județene Cluj în iulie 2025.",
    order: 1,
  },
]
