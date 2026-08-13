"use client"

import { useRef, useState } from "react"
import type { MouseEvent, TouchEvent } from "react"
import Image from "next/image"

interface BeforeAfterComparisonProps {
  beforeSrc: string
  afterSrc: string
  alt: string
  beforeLabel?: string
  afterLabel?: string
  instruction?: string
  resetOnMouseLeave?: boolean
}

export default function BeforeAfterComparison({
  beforeSrc,
  afterSrc,
  alt,
  beforeLabel = "Before",
  afterLabel = "After",
  instruction = "Drag or hover to compare",
  resetOnMouseLeave = true,
}: BeforeAfterComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isInteracting, setIsInteracting] = useState(false)

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    updateSliderPosition(event.clientX)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    setIsInteracting(true)
    updateSliderPosition(event.touches[0].clientX)
  }

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    setIsInteracting(true)
    updateSliderPosition(event.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    setIsInteracting(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl shadow-2xl cursor-ew-resize group"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setIsInteracting(false)
        if (resetOnMouseLeave) {
          setSliderPosition(50)
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={afterSrc}
          alt={`After - ${alt}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden transition-all duration-200 ease-out"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={beforeSrc}
          alt={`Before - ${alt}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
        />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-200 ease-out"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <div className="h-4 w-4 rounded-full bg-black" />
        </div>
      </div>

      <div className="absolute left-4 top-4 rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div className="absolute right-4 top-4 rounded-lg bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
        {afterLabel}
      </div>

      {!isInteracting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300">
          <div className="rounded-lg bg-white/90 px-5 py-3 text-center text-sm font-medium text-black backdrop-blur-sm sm:text-base">
            {instruction}
          </div>
        </div>
      )}
    </div>
  )
}
