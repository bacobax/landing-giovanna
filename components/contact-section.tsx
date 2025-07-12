"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="relative py-20 px-4 bg-accent-pink text-gray-800 overflow-hidden">
      {/* Subtle background rounded shapes */}
      <div className="absolute top-0 left-0 w-full h-full bg-accent-pink rounded-br-[200px] opacity-30" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-primary-tan rounded-br-[200px] opacity-30" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900">Contattami</h2>
        <p className="text-lg text-gray-700">
          Hai domande, richieste di commissione o semplicemente vuoi salutarmi? Sono sempre felice di ricevere messaggi!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="px-8 py-6 text-lg bg-primary-tan hover:bg-primary-tan/90 text-white rounded-full shadow-lg"
          >
            <Link href="mailto:giovanna.frigo66@gmail.com?subject=Richiesta%20da%20sito%20web">Email</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="px-8 py-6 text-lg border-primary-tan text-primary-tan hover:bg-primary-tan/10 rounded-full shadow-lg bg-transparent"
          >
            <Link href="/social">Seguimi sui social</Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 