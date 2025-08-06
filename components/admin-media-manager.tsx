"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  src: string
  alt: string
  title: string
  description: string
  medium: "image" | "video"
  year: string
  show_reel?: boolean
  reel_only?: boolean
}

interface DraftItem extends MediaItem {
  file?: File
}

const visibilityOptions = [
  {
    value: "gallery",
    label: "Solo galleria",
    color: "border-green-600 text-green-600",
    active: "bg-green-600 text-white",
  },
  {
    value: "reels",
    label: "Solo reels",
    color: "border-purple-600 text-purple-600",
    active: "bg-purple-600 text-white",
  },
  {
    value: "both",
    label: "Entrambi",
    color: "border-blue-600 text-blue-600",
    active: "bg-blue-600 text-white",
  },
  {
    value: "none",
    label: "Nessuno",
    color: "border-gray-600 text-gray-600",
    active: "bg-gray-600 text-white",
  },
]

export function AdminMediaManager() {
  const { data: session } = useSession()
  const [media, setMedia] = useState<DraftItem[]>([])
  const [loading, setLoading] = useState(true)
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  useEffect(() => {
    if (session) {
      fetchAll()
    }
  }, [session])

  async function fetchAll() {
    setLoading(true)
    const [imgsRes, vidsRes] = await Promise.all([
      fetch("/api/image?all=1"),
      fetch("/api/video?all=1"),
    ])
    const [imgs, vids] = await Promise.all([imgsRes.json(), vidsRes.json()])
    setMedia([...imgs, ...vids])
    setLoading(false)
  }

  const visibilityValue = (item: MediaItem) => {
    if (item.show_reel) {
      return item.reel_only ? "reels" : "both"
    }
    return item.reel_only ? "none" : "gallery"
  }

  const handleVisibilityChange = (id: string, medium: string, value: string) => {
    setMedia(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              show_reel: value === "reels" || value === "both",
              reel_only: value === "reels" || value === "none",
            }
          : item
      )
    )
  }

  const handleFieldChange = (id: string, field: keyof DraftItem, value: string) => {
    setMedia(prev => prev.map(item => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleFileChange = (id: string, file?: File) => {
    setMedia(prev => prev.map(item => (item.id === id ? { ...item, file } : item)))
  }

  const saveItem = async (item: DraftItem) => {
    await fetch(`/api/${item.medium}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        year: item.year,
        alt: item.alt,
        show_reel: item.show_reel,
        reel_only: item.reel_only,
      }),
    })

    if (item.file) {
      const formData = new FormData()
      formData.append("file", item.file)
      await fetch(`/api/${item.medium}/${item.id}`, {
        method: "PUT",
        body: formData,
      })
    }
    await fetchAll()
    window.dispatchEvent(new Event("mediaUpdated"))
  }

  if (!session) return null

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">Gestione Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="space-y-2 p-4">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-6 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              : media.map(item => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="relative h-48 bg-gray-200">
                      {item.medium === "image" ? (
                        <Image
                          src={`/api/image/${item.id}`}
                          alt={item.alt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={`/api/video/${item.id}`}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>
                    <CardContent className="space-y-2 p-4">
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => handleFieldChange(item.id, "title", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                      <textarea
                        value={item.description}
                        onChange={e => handleFieldChange(item.id, "description", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={item.year}
                        onChange={e => handleFieldChange(item.id, "year", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                      <input
                        type="text"
                        value={item.alt}
                        onChange={e => handleFieldChange(item.id, "alt", e.target.value)}
                        className="w-full border rounded px-2 py-1"
                      />
                      <div className="flex flex-wrap gap-2">
                        {visibilityOptions.map(opt => {
                          const selected = visibilityValue(item) === opt.value
                          return (
                            <Button
                              key={opt.value}
                              type="button"
                              variant="outline"
                              className={cn(
                                "text-xs",
                                selected ? opt.active : opt.color
                              )}
                              onClick={() =>
                                handleVisibilityChange(item.id, item.medium, opt.value)
                              }
                            >
                              {opt.label}
                            </Button>
                          )
                        })}
                      </div>
                      <div className="space-y-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputs.current[item.id]?.click()}
                        >
                          {item.file ? "File selezionato" : "Seleziona file"}
                        </Button>
                        <input
                          type="file"
                          ref={el => (fileInputs.current[item.id] = el)}
                          onChange={e => handleFileChange(item.id, e.target.files?.[0])}
                          className="hidden"
                        />
                        {item.file && (
                          <div className="text-xs text-gray-600 truncate">
                            {item.file.name}
                          </div>
                        )}
                      </div>
                      <Button onClick={() => saveItem(item)} className="mt-2">
                        Salva
                      </Button>
                    </CardContent>
                  </Card>
                ))}
          </div>
      </div>
    </section>
  )
}

