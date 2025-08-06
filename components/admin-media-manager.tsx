"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

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
  file?: File | null
}

export function AdminMediaManager() {
  const { data: session } = useSession()
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMedia = async () => {
    try {
      const [imgsRes, vidsRes] = await Promise.all([
        fetch("/api/image?all=1"),
        fetch("/api/video?all=1"),
      ])
      const [imgs, vids] = await Promise.all([imgsRes.json(), vidsRes.json()])
      setMedia([...imgs, ...vids])
    } catch {
      setMedia([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchMedia()
    }
  }, [session])

  if (!session) return null

  if (loading) {
    return <div className="text-center py-12">Caricamento media...</div>
  }

  const handleInputChange = (
    id: string,
    field: keyof MediaItem,
    value: string | File | null
  ) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleVisibilityChange = (id: string, value: string) => {
    let show_reel = false
    let reel_only = false
    if (value === "reels") {
      show_reel = true
      reel_only = true
    } else if (value === "both") {
      show_reel = true
      reel_only = false
    } else if (value === "none") {
      show_reel = false
      reel_only = true
    }
    handleInputChange(id, "show_reel", show_reel)
    handleInputChange(id, "reel_only", reel_only)
  }

  const visibilityValue = (item: MediaItem) => {
    if (item.reel_only && item.show_reel) return "reels"
    if (!item.reel_only && item.show_reel) return "both"
    if (item.reel_only && !item.show_reel) return "none"
    return "gallery"
  }

  const handleSave = async (item: MediaItem) => {
    await fetch(`/api/${item.medium}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: item.title,
        description: item.description,
        alt: item.alt,
        year: item.year,
        show_reel: item.show_reel,
        reel_only: item.reel_only,
      }),
    })
    fetchMedia()
  }

  const handleReplace = async (item: MediaItem) => {
    if (!item.file) return
    const formData = new FormData()
    formData.append("file", item.file)
    await fetch(`/api/${item.medium}/${item.id}`, {
      method: "PUT",
      body: formData,
    })
    handleInputChange(item.id, "file", null)
    fetchMedia()
  }

  return (
    <section id="admin-media" className="py-20 px-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-center">Gestione Media</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {media.map((item) => (
          <div key={item.id} className="border rounded p-4 bg-white space-y-2">
            <div className="w-full h-40 overflow-hidden flex items-center justify-center bg-gray-100">
              {item.medium === "image" ? (
                <Image
                  src={`/api/image/${item.id}?cb=${Date.now()}`}
                  alt={item.alt}
                  width={200}
                  height={160}
                  className="object-cover w-full h-full"
                />
              ) : (
                <video
                  src={`/api/video/${item.id}?cb=${Date.now()}`}
                  className="object-cover w-full h-full"
                  controls
                />
              )}
            </div>
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleInputChange(item.id, "title", e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Titolo"
            />
            <textarea
              value={item.description}
              onChange={(e) =>
                handleInputChange(item.id, "description", e.target.value)
              }
              className="w-full border rounded px-2 py-1"
              placeholder="Descrizione"
            />
            <input
              type="text"
              value={item.year}
              onChange={(e) => handleInputChange(item.id, "year", e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Anno"
            />
            <input
              type="text"
              value={item.alt}
              onChange={(e) => handleInputChange(item.id, "alt", e.target.value)}
              className="w-full border rounded px-2 py-1"
              placeholder="Alt text"
            />
            <select
              value={visibilityValue(item)}
              onChange={(e) => handleVisibilityChange(item.id, e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="gallery">Solo galleria</option>
              <option value="reels">Solo reels</option>
              <option value="both">Entrambi</option>
              <option value="none">Nessuno</option>
            </select>
            <input
              type="file"
              onChange={(e) =>
                handleInputChange(item.id, "file", e.target.files?.[0] || null)
              }
              className="w-full text-sm"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={() => handleSave(item)}>
                Salva
              </Button>
              {item.file && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleReplace(item)}
                >
                  Sostituisci media
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

