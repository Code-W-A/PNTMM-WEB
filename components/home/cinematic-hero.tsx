"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"
import { EditorialMedia } from "@/components/shared/editorial-media"
import { Button } from "@/components/ui/button"

const heroDirections = [
  {
    id: "proiect-de-tara",
    index: "01",
    eyebrow: "Proiect de țară",
    title: "Renașterea morală și reîntregirea națională",
    description:
      "Acțiunea politică a PNȚMM este orientată spre renașterea morală a României, fundament al dezvoltării ei sustenabile, și spre reîntregirea națională a țării.",
    imageUrl: "/demo/hero-comunitate.jpg",
  },
  {
    id: "doctrina",
    index: "02",
    eyebrow: "Doctrină",
    title: "Politica nu poate fi despărțită de morală",
    description:
      "Un partid de centru, creștin-democrat, pentru care dezvoltarea economică se îmbină cu distribuția echitabilă a bunăstării.",
    imageUrl: "/demo/hero-dialog.jpg",
  },
  {
    id: "traditie",
    index: "03",
    eyebrow: "Tradiție",
    title: "Moștenirea lui Maniu și Mihalache",
    description:
      "PNȚMM se revendică drept continuatorul Partidului Național Țărănesc condus de Iuliu Maniu și Ion Mihalache și al PNȚCD condus de Corneliu Coposu.",
    imageUrl: "/demo/hero-initiativa.jpg",
  },
] as const

export function CinematicHero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const reduceMotion = useReducedMotion()
  const activeDirection = heroDirections[activeIndex]

  useEffect(() => {
    if (reduceMotion || !autoplay) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroDirections.length)
    }, 6500)

    return () => window.clearInterval(interval)
  }, [autoplay, reduceMotion])

  function selectDirection(index: number, focus = false) {
    setActiveIndex(index)
    setAutoplay(false)
    if (focus) tabsRef.current[index]?.focus()
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % heroDirections.length
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + heroDirections.length) % heroDirections.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = heroDirections.length - 1
    }

    if (nextIndex !== null) {
      event.preventDefault()
      selectDirection(nextIndex, true)
    }
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[46rem] overflow-hidden bg-primary-dark text-white sm:min-h-[48rem] lg:h-[calc(100svh-5.25rem)] lg:min-h-[45rem]"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={activeDirection.id}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={transition}
        >
          <EditorialMedia
            imageUrl={activeDirection.imageUrl}
            alt={`Imagine ilustrativă pentru tema ${activeDirection.eyebrow.toLowerCase()}`}
            aspect="hero"
            priority={activeIndex === 0}
            className="absolute inset-0 h-full w-full !aspect-auto rounded-none shadow-none"
          />
        </motion.div>
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,42,0.92)_0%,rgba(8,14,42,0.72)_48%,rgba(8,14,42,0.38)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,14,42,0.85)_0%,transparent_50%)]"
      />

      <Container className="relative z-10 flex min-h-full flex-col pb-7 pt-14 sm:pb-9 sm:pt-20 lg:pb-10 lg:pt-24">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeDirection.id}
                id="hero-panel"
                role="tabpanel"
                aria-labelledby={`hero-tab-${activeDirection.id}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={transition}
                className="absolute inset-0 flex items-end sm:items-center"
              >
                <div className="max-w-3xl pb-2">
                  <p className="eyebrow mb-5 flex items-center gap-3 text-accent">
                    <span className="h-px w-10 bg-accent" aria-hidden="true" />
                    {activeDirection.eyebrow} · {activeDirection.index}
                  </p>
                  <h1
                    id="hero-title"
                    className="max-w-[18ch] font-heading text-[clamp(2.4rem,6.5vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.045em] sm:max-w-[16ch]"
                  >
                    {activeDirection.title}
                  </h1>
                  <p className="body-lg mt-5 max-w-xl text-white/82 sm:mt-6">
                    {activeDirection.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-20 shrink-0 pt-6 pb-8 sm:pt-8 sm:pb-10">
            <div className="flex flex-col gap-3 min-[380px]:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link href="/implica-te">
                  Implică-te <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondaryOutline"
                size="lg"
                className="focus-visible:ring-white focus-visible:ring-offset-primary-dark"
              >
                <Link href="/despre-noi">Aflați mai multe</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative z-20 shrink-0 grid gap-5 border-t border-white/20 pt-5 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-14">
          <a
            href="#misiune"
            className="meta hidden items-center gap-2 text-white/65 outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-dark lg:inline-flex"
          >
            Descoperă <ArrowDown aria-hidden="true" className="h-4 w-4" />
          </a>
          <div
            role="tablist"
            aria-label="Selectați tema principală"
            className="grid grid-cols-1 divide-y divide-white/15 min-[420px]:grid-cols-3 min-[420px]:divide-x min-[420px]:divide-y-0"
          >
            {heroDirections.map((direction, index) => {
              const isActive = index === activeIndex

              return (
                <button
                  key={direction.id}
                  ref={(node) => {
                    tabsRef.current[index] = node
                  }}
                  type="button"
                  id={`hero-tab-${direction.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="hero-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectDirection(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className="group min-w-0 px-0 py-3.5 text-left outline-none ui-transition focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-dark min-[420px]:px-4 min-[420px]:first:pl-0 min-[420px]:last:pr-0 sm:py-4"
                >
                  <span
                    className={`mb-2.5 block h-0.5 origin-left bg-accent transition-transform duration-500 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="meta block text-white/50">
                    {direction.index}
                  </span>
                  <span
                    className={`mt-1.5 block truncate text-sm font-semibold ui-transition ${
                      isActive
                        ? "text-white"
                        : "text-white/65 group-hover:text-white"
                    }`}
                  >
                    {direction.eyebrow}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
