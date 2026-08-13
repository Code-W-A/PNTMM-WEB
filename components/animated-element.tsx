"use client"

import type React from "react"

import { motion, type Variants } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

interface AnimatedElementProps {
  children: React.ReactNode
  className?: string
  animationType?: "fadeIn" | "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn"
  delay?: number
  duration?: number
  once?: boolean // Whether the animation should only run once
  amount?: number // How much of the element needs to be in view to trigger (0 to 1)
  staggerChildren?: number // If this element has children, stagger their animation
  rootMargin?: string // Add custom root margin for earlier triggering
}

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
}

// Check if user is on mobile device
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768 || 'ontouchstart' in window
}

export default function AnimatedElement({
  children,
  className,
  animationType = "fadeInUp",
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.2,
  staggerChildren,
  rootMargin = "100px", // Default margin to trigger earlier
}: AnimatedElementProps) {
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
    
    const handleResize = () => {
      setIsMobileDevice(isMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile-optimized intersection observer settings
  const intersectionConfig = {
    triggerOnce: once,
    threshold: isMobileDevice ? 0.05 : amount, // Lower threshold for mobile
    rootMargin: isMobileDevice ? "150px" : rootMargin, // Larger margin for mobile
    skip: false,
  }

  const { ref, inView } = useInView(intersectionConfig)

  const selectedVariant = animationVariants[animationType] || animationVariants.fadeInUp

  // Reduced animation duration for mobile to feel more responsive
  const adjustedDuration = isMobileDevice ? Math.min(duration * 0.7, 0.4) : duration
  const adjustedDelay = isMobileDevice ? Math.min(delay * 0.5, 0.2) : delay

  const variantsWithDelay: Variants = {
    hidden: selectedVariant.hidden,
    visible: {
      ...selectedVariant.visible,
      transition: {
        duration: adjustedDuration,
        delay: adjustedDelay,
        ease: "easeOut", // Smoother easing for mobile
        ...(staggerChildren && { staggerChildren: isMobileDevice ? staggerChildren * 0.5 : staggerChildren }),
      },
    },
  }

  // On mobile, if animation is disabled or reduced motion is preferred, just show content
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (prefersReducedMotion) {
    return <div ref={ref} className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variantsWithDelay}
      className={className}
      // Add will-change for better mobile performance
      style={{ willChange: inView ? 'transform, opacity' : 'auto' }}
    >
      {children}
    </motion.div>
  )
}
