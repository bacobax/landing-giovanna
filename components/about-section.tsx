"use client"

import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="relative py-20 px-4 bg-primary-tan text-white overflow-hidden">
      {/* Subtle background stripes */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: "20px 20px",
          backgroundImage:
            "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)",
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold leading-tight">Chi sono</h2>
          <p className="text-lg leading-relaxed">
          Sono un’artista autodidatta che esprime la propria visione attraverso dipinti unici e opere materiche.
          La mia ispirazione nasce dall’armonia della natura: dalle sfumature cangianti del mare e delle spiagge, ai colori vividi dei fiori, fino alla poesia racchiusa nei gesti semplici della vita quotidiana.
          </p>
          <p className="text-lg leading-relaxed">
          Ogni opera prende vita con cura e profondo amore per il gesto creativo, nel tentativo di evocare emozioni che spaziano dalla quiete alla burrasca, dall’enigma alla meraviglia.
          Credo che l’arte debba essere accessibile, capace di trasformare gli spazi con un tocco di eleganza e autenticità.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-90 h-90 rounded-full border-4 border-white shadow-xl overflow-hidden relative">
            <Image
              src="/assets/picprofile.JPG"
              width={500}
              height={500}
              alt="Artist's portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 