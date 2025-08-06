"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { GalleryImage } from "@/lib/gallery"

export function GalleryContent() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description
    return description.substring(0, maxLength).trim() + "..."
  }

  async function fetchImages() {
    try {
      const res = await fetch("/api/image")
      const data = await res.json()
      setImages(data)
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-600">Caricamento galleria...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <p className="text-lg text-center max-w-3xl mx-auto text-gray-700">
        Esplora una selezione di opere uniche e curate. Ogni opera racconta una storia e è progettata per trasformare gli spazi
        con eleganza e autenticità.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => {
          const isExpanded = expandedCards.has(image.id)
          const displayDescription = isExpanded ? image.description : truncateDescription(image.description)

          return (
            <Card
              key={image.id}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={`/api/image/${image.id}?cb=${Date.now()}`}
                  width={400}
                  height={300}
                  alt={image.alt}
                  className="w-full h-60 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-0"></div>
              </div>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-xl font-playfair font-semibold text-gray-900">{image.title}</h3>
                <p className="text-gray-600 text-sm">{image.medium}, {image.year}</p>
                <p className="text-gray-700">{displayDescription}</p>
                {image.description.length > 150 && (
                  <><Button
                    variant="link"
                    className="p-0 h-auto text-primary-tan hover:text-primary-tan/80"
                    onClick={() => toggleCardExpansion(image.id)}
                  >
                    {isExpanded ? "Leggi meno" : "Leggi di più"}
                  </Button><br /></>
                )}
                <Button variant="link" className="p-0 h-auto text-primary-tan hover:text-primary-tan/80">
                  Scopri di più
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
