"use client"

import { useState, useEffect } from "react"
import { X, Play } from "lucide-react"
import AnimatedElement from "@/components/animated-element"

interface ProjectVideoShowcaseProps {
  videoId: string
  title: string
  description: string
}

export default function ProjectVideoShowcase({ videoId, title, description }: ProjectVideoShowcaseProps) {
  const [showModal, setShowModal] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      }
    }

    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      {/* Video Showcase Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AnimatedElement animationType="fadeInUp" className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-xl mb-4 transform rotate-45">
              <div className="w-6 h-6 bg-white rounded transform -rotate-45" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Project Showcase
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </AnimatedElement>

          {/* Large Video Container */}
          <AnimatedElement animationType="fadeInUp" delay={0.2}>
            <div 
              className="relative group cursor-pointer"
              onClick={openModal}
            >
              {/* Video Container */}
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:scale-[1.02]">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>

                {/* Video Embed */}
                <div className="relative aspect-video">
                  {isMounted ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=1&controls=0&title=0&byline=0&portrait=0&badge=0&autopause=0&background=1&player_id=0&app_id=58479`}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      title={title}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
                  )}
                </div>

                {/* Info Card - Hidden animation on mobile */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-xl p-6 transform translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 z-20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
                      <p className="text-gray-600 text-sm">
                        Click to view fullscreen with controls
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 bg-black rounded-full flex items-center justify-center ml-4">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Decorative Corners - Hidden on mobile */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/30 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/30 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          </AnimatedElement>
        </div>
      </section>

      {/* Premium Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-7xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 text-white transition-all duration-200 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Info Header */}
            <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-sm opacity-80">Project Showcase Video</p>
            </div>

            {/* Full-size Video with Controls */}
            <iframe
              src={`https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&muted=0&controls=1&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              className="w-full h-full"
              title="Video Player"
            />
          </div>

          {/* Instructions */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center">
            <p>Press <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd> or click outside to close</p>
          </div>
        </div>
      )}
    </>
  )
} 
