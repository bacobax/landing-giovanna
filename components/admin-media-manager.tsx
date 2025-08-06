"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

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

interface NewItem {
  file?: File
  medium: "image" | "video"
  title: string
  description: string
  year: string
  alt: string
  show_reel: boolean
  reel_only: boolean
}

const visibilityOptions = [
  { value: "gallery", label: "Solo galleria" },
  { value: "reels", label: "Solo reels" },
  { value: "both", label: "Entrambi" },
  { value: "none", label: "Nessuno" }
]

export function AdminMediaManager() {
  const { data: session } = useSession()
  const [media, setMedia] = useState<DraftItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedPreview, setLoadedPreview] = useState<{ [key: string]: boolean }>({})
  // cache buster to force refresh of previews when media changes
  const [cacheBuster, setCacheBuster] = useState(Date.now())
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({})
  const newFileInput = useRef<HTMLInputElement | null>(null)

  const emptyNewItem: NewItem = {
    medium: "image",
    title: "",
    description: "",
    year: "",
    alt: "",
    show_reel: false,
    reel_only: false,
  }
  const [newItem, setNewItem] = useState<NewItem>(emptyNewItem)

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
    // update cache buster to avoid showing stale previews
    setCacheBuster(Date.now())
  }

  const visibilityValue = (item: { show_reel?: boolean; reel_only?: boolean }) => {
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

  const handleNewFieldChange = (field: keyof NewItem, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value } as NewItem))
  }

  const handleNewVisibilityChange = (value: string) => {
    setNewItem(prev => ({
      ...prev,
      show_reel: value === "reels" || value === "both",
      reel_only: value === "reels" || value === "none",
    }))
  }

  const handleNewFileChange = (file?: File) => {
    setNewItem(prev => ({ ...prev, file }))
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

  const addNewMedia = async () => {
    if (!newItem.file) return
    const formData = new FormData()
    formData.append("file", newItem.file)
    formData.append("alt", newItem.alt)
    formData.append("title", newItem.title)
    formData.append("description", newItem.description)
    formData.append("year", newItem.year)
    formData.append("show_reel", String(newItem.show_reel))
    formData.append("reel_only", String(newItem.reel_only))
    await fetch(`/api/${newItem.medium}`, {
      method: "POST",
      body: formData,
    })
    setNewItem(emptyNewItem)
    if (newFileInput.current) newFileInput.current.value = ""
    await fetchAll()
    window.dispatchEvent(new Event("mediaUpdated"))
  }

  const deleteItem = async (item: DraftItem) => {
    if (!confirm("Sei sicuro di voler eliminare questo media?")) return
    await fetch(`/api/${item.medium}/${item.id}`, { method: "DELETE" })
    await fetchAll()
    window.dispatchEvent(new Event("mediaUpdated"))
  }

  if (!session) return null

  const tagStyles: Record<string, string> = {
    gallery: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    reels: "bg-green-100 text-green-800 hover:bg-green-200",
    both: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    none: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  }

  return (
    <section className="py-20 px-4 bg-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-center">Gestione Media</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex gap-2">
                    {visibilityOptions.map(opt => (
                      <Skeleton key={opt.value} className="h-6 w-16" />
                    ))}
                  </div>
                  <Skeleton className="h-9 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <CardContent className="space-y-2 p-4">
                <h3 className="text-xl font-semibold">Aggiungi media</h3>
                <select
                  value={newItem.medium}
                  onChange={e =>
                    handleNewFieldChange("medium", e.target.value as "image" | "video")
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="image">Immagine</option>
                  <option value="video">Video</option>
                </select>
                <Input
                  type="text"
                  placeholder="Titolo"
                  value={newItem.title}
                  onChange={e => handleNewFieldChange("title", e.target.value)}
                />
                <textarea
                  placeholder="Descrizione"
                  value={newItem.description}
                  onChange={e => handleNewFieldChange("description", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Input
                  type="text"
                  placeholder="Anno"
                  value={newItem.year}
                  onChange={e => handleNewFieldChange("year", e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Alt"
                  value={newItem.alt}
                  onChange={e => handleNewFieldChange("alt", e.target.value)}
                />
                <div className="flex flex-wrap gap-2 py-1">
                  {visibilityOptions.map(opt => {
                    const selected = visibilityValue(newItem) === opt.value
                    return (
                      <Button
                        key={opt.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleNewVisibilityChange(opt.value)}
                        className={
                          "rounded-full px-2 py-1 text-xs " +
                          tagStyles[opt.value] +
                          (selected ? " ring-2 ring-offset-2 ring-gray-400" : " opacity-60")
                        }
                      >
                        {opt.label}
                      </Button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={newFileInput}
                    onChange={e => handleNewFileChange(e.target.files?.[0])}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => newFileInput.current?.click()}
                  >
                    {newItem.file ? "Cambiato" : "Seleziona file"}
                  </Button>
                  {newItem.file && <span className="text-xs text-gray-600">{newItem.file.name}</span>}
                </div>
                <Button onClick={addNewMedia} className="mt-2" disabled={!newItem.file}>
                  Aggiungi
                </Button>
              </CardContent>
            </Card>
            {media.map(item => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-200">
                  {!loadedPreview[item.id] && <Skeleton className="absolute inset-0 h-full w-full" />}
                  {item.medium === "image" ? (
                    <Image
                      src={`/api/image/${item.id}?cb=${cacheBuster}`}
                      alt={item.alt}
                      fill
                      className="object-cover"
                      onLoadingComplete={() =>
                        setLoadedPreview(prev => ({ ...prev, [item.id]: true }))
                      }
                    />
                  ) : (
                    <video
                      src={`/api/video/${item.id}?cb=${cacheBuster}`}
                      className="w-full h-full object-cover"
                      controls
                      onLoadedData={() =>
                        setLoadedPreview(prev => ({ ...prev, [item.id]: true }))
                      }
                    />
                  )}
                </div>
                <CardContent className="space-y-2 p-4">
                  <Input
                    type="text"
                    value={item.title}
                    onChange={e => handleFieldChange(item.id, "title", e.target.value)}
                  />
                  <textarea
                    value={item.description}
                    onChange={e => handleFieldChange(item.id, "description", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <Input
                    type="text"
                    value={item.year}
                    onChange={e => handleFieldChange(item.id, "year", e.target.value)}
                  />
                  <Input
                    type="text"
                    value={item.alt}
                    onChange={e => handleFieldChange(item.id, "alt", e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 py-1">
                    {visibilityOptions.map(opt => {
                      const selected = visibilityValue(item) === opt.value
                      return (
                        <Button
                          key={opt.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleVisibilityChange(item.id, item.medium, opt.value)
                          }
                          className={
                            "rounded-full px-2 py-1 text-xs " +
                            tagStyles[opt.value] +
                            (selected ? " ring-2 ring-offset-2 ring-gray-400" : " opacity-60")
                          }
                        >
                          {opt.label}
                        </Button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={el => {
                        fileInputs.current[item.id] = el
                      }}
                      onChange={e => handleFileChange(item.id, e.target.files?.[0])}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputs.current[item.id]?.click()}
                    >
                      {item.file ? "Cambiato" : "Seleziona file"}
                    </Button>
                    {item.file && <span className="text-xs text-gray-600">{item.file.name}</span>}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => saveItem(item)}>Salva</Button>
                    <Button variant="destructive" onClick={() => deleteItem(item)}>
                      Elimina
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

