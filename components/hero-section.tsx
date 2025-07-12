"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center overflow-hidden bg-white-shade">
      {/* Subtle background shapes - floral hint with animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-tan rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 animate-float-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-pink rounded-full opacity-20 translate-x-1/2 -translate-y-1/2 animate-float-medium" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary-tan rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2 animate-float-fast" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight text-gray-900 flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-4">
          <span>Minimal Atelier</span>
          <span className="text-2xl md:text-3xl font-normal text-primary-tan">
            By Gio
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Scopri un mondo di dipinti unici e creazioni artistiche, dove la bellezza fiorisce in ogni dettaglio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="px-8 py-6 text-lg bg-primary-tan hover:bg-primary-tan/90 text-white rounded-full shadow-lg"
          >
            <Link href="#gallery">Esplora opere</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-6 text-lg border-primary-tan text-primary-tan hover:bg-primary-tan/10 rounded-full shadow-lg bg-transparent"
          >
            <Link href="#contact">Contattami</Link>
          </Button>
        </div>
      </div>

      {/* Floating down arrow */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 group"
        aria-label="Scroll to next section"
      >
        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group-hover:bg-white">
          <svg
            className="w-6 h-6 text-gray-600 group-hover:text-primary-tan transition-colors duration-300 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>
    </section>
  )
} 