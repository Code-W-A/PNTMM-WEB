"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ImageConfig {
  src: string
  alt?: string
  zoom?: number
  offsetX?: number
  offsetY?: number
}

interface MobileSlideshowProps {
  images: ImageConfig[]
  autoPlay?: boolean
  interval?: number
}

export default function MobileSlideshow({ 
  images, 
  autoPlay = true, 
  interval = 3000 
}: MobileSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, images.length, interval])

  if (images.length === 0) return null

  return (
    <div className="lg:hidden relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-100 mb-8">
      {/* Container with proper aspect ratio */}
      <div className="relative w-full h-64 sm:h-72">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw"
            />
          </div>
        ))}
      </div>

      {/* Simple dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentIndex 
                ? 'bg-white' 
                : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Debug counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
} 