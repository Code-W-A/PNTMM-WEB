import type { DemoImageRef } from "@/types"

/**
 * Imagini DEMO locale (stock). Nu reprezintă persoane, evenimente sau acțiuni PNTMM.
 * Înlocuiți path-urile când există material oficial aprobat.
 */
export const demoImages = {
  aboutHero: {
    src: "/demo/about-hero.jpg",
    alt: "Imagine demonstrativă — discuție într-un grup de lucru",
    isDemo: true,
  },
  aboutWhoWeAre: {
    src: "/demo/about-who.jpg",
    alt: "Imagine demonstrativă — colaborare într-un spațiu de lucru",
    isDemo: true,
  },
  aboutMission: {
    src: "/demo/about-mission.jpg",
    alt: "Imagine demonstrativă — implicare civică într-o comunitate",
    isDemo: true,
  },
  aboutDirections: [
    {
      src: "/demo/about-direction-1.jpg",
      alt: "Imagine demonstrativă — prezentare într-un cadru profesional",
      isDemo: true,
    },
    {
      src: "/demo/project-02.jpg",
      alt: "Imagine demonstrativă — echipă în discuție",
      isDemo: true,
    },
    {
      src: "/demo/project-03.jpg",
      alt: "Imagine demonstrativă — sesiune de lucru în grup",
      isDemo: true,
    },
  ] satisfies DemoImageRef[],
  /*
   * Galeria „comunitate" din /despre-noi nu are imagini demonstrative: acolo o
   * fotografie de stoc ar sugera o activitate locală care nu a avut loc.
   * Secțiunea rămâne ascunsă până când `aboutPageContent.communityItems`
   * primește fotografii reale de la filială.
   */
} as const
