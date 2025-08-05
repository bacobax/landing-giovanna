"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import { GalleryImage } from "@/lib/gallery"
import { useSession } from "next-auth/react"


export function GalleryContent() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [addingNew, setAddingNew] = useState(false)
  const [newMedia, setNewMedia] = useState({
    title: "",
    medium: "",
    year: "",
    description: "",
    file: null as File | null,
    alt: "",
    gallery: true,
    reels: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Remove useFormState and server action logic
  // const uploadImageReducer = async (state: any, formData: FormData) => {
  //   return await uploadImage(formData)
  // }
  // const [formState, formAction] = useFormState(uploadImageReducer, null)
  const [formState, setFormState] = useState<{ success?: boolean; error?: string } | null>(null);
  const { data: session } = useSession();

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

  const handleNewMediaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files, type, checked } = e.target as HTMLInputElement
    if (name === "file" && files) {
      setNewMedia((prev) => ({ ...prev, file: files[0] }))
    } else if (type === "checkbox") {
      setNewMedia((prev) => ({ ...prev, [name]: checked }))
    } else {
      setNewMedia((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Add a handler for form submission
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormState(null);
    const formData = new FormData();
    if (newMedia.file) formData.append("file", newMedia.file);
    formData.append("title", newMedia.title);
    formData.append("medium", newMedia.medium);
    formData.append("year", newMedia.year);
    formData.append("description", newMedia.description);
    formData.append("alt", newMedia.alt);
    formData.append("show_reel", String(newMedia.reels));
    formData.append("reel_only", String(newMedia.reels && !newMedia.gallery));
    try {
      const isVideo = newMedia.file?.type.startsWith("video");
      const res = await fetch(isVideo ? "/api/video" : "/api/image", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success) {
        setFormState({ success: true });
        fetchImages();
        setNewMedia({
          title: "",
          medium: "",
          year: "",
          description: "",
          file: null,
          alt: "",
          gallery: true,
          reels: false,
        });
        setAddingNew(false);
      } else {
        setFormState({ error: data.error || "Errore durante il caricamento." });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setFormState({ error: "Errore di rete." });
    } finally {
      setSubmitting(false);
    }
  };

  // Move fetchImages outside useEffect so it can be called elsewhere
  async function fetchImages() {
    try {
      const res = await fetch("/api/image");
      const data = await res.json();
      setImages(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateTags(id: string, gallery: boolean, reels: boolean) {
    try {
      await fetch(`/api/image/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          show_reel: reels,
          reel_only: reels && !gallery,
        }),
      });
      fetchImages();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      /* ignore errors */
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  // Add useEffect to handle post-upload actions
  useEffect(() => {
    if (formState?.success) {
      fetchImages();
      setNewImage({
        title: "",
        medium: "",
        year: "",
        description: "",
        file: null,
        alt: "",
      });
      setAddingNew(false); // Optionally close the form after upload
    }
  }, [formState?.success]);

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
        Esplora una selezione di opere uniche e curate. Ogni opera racconta una storia e è progettata per trasformare gli spazi con eleganza e autenticità.
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
                {session && (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!image.reel_only}
                          onChange={(e) =>
                            updateTags(image.id, e.target.checked, image.show_reel === true)
                          }
                        />
                        Gallery
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={image.show_reel === true}
                          onChange={(e) =>
                            updateTags(image.id, !image.reel_only, e.target.checked)
                          }
                        />
                        Reels
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          if (confirm("Sei sicuro di voler eliminare questa immagine?")) {
                            const res = await fetch(`/api/image/${image.id}`, { method: "DELETE" });
                            if (res.ok) fetchImages();
                          }
                        }}
                      >
                        Elimina
                      </Button>
                      <label className="inline-block">
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch(`/api/image/${image.id}`, {
                              method: "PUT",
                              body: formData,
                            });
                            if (res.ok) fetchImages();
                          }}
                        />
                        <Button asChild variant="secondary" size="sm">
                          <span>Modifica</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
        {session && (
          addingNew ? (
            <form onSubmit={handleUploadSubmit} className="flex flex-col justify-between h-full w-full">
              <Card className="overflow-hidden rounded-lg shadow-lg bg-white">
                <div className="relative overflow-hidden flex items-center justify-center h-60 bg-gray-100">
                  {newMedia.file ? (
                    newMedia.file.type.startsWith("video") ? (
                      <video
                        src={URL.createObjectURL(newMedia.file)}
                        className="w-full h-60 object-cover"
                        controls
                      />
                    ) : (
                      <Image
                        src={URL.createObjectURL(newMedia.file)}
                        width={400}
                        height={300}
                        alt={newMedia.alt || "preview"}
                        className="w-full h-60 object-cover"
                      />
                    )
                  ) : (
                    <span className="text-gray-400">Anteprima media</span>
                  )}
                </div>
                <CardContent className="p-6 space-y-2">
                  <input
                    type="file"
                    name="file"
                    accept="image/*,video/*"
                    ref={fileInputRef}
                    onChange={handleNewMediaChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-tan/20 file:text-primary-tan hover:file:bg-primary-tan/40"
                    required
                  />
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="gallery"
                        checked={newMedia.gallery}
                        onChange={handleNewMediaChange}
                      />
                      Gallery
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="reels"
                        checked={newMedia.reels}
                        onChange={handleNewMediaChange}
                      />
                      Reels
                    </label>
                  </div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Titolo"
                    value={newMedia.title}
                    onChange={handleNewMediaChange}
                    className="w-full border rounded px-2 py-1 mt-2"
                    required
                  />
                  <input
                    type="text"
                    name="medium"
                    placeholder="Tecnica"
                    value={newMedia.medium}
                    onChange={handleNewMediaChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                  <input
                    type="text"
                    name="year"
                    placeholder="Anno"
                    value={newMedia.year}
                    onChange={handleNewMediaChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                  <input
                    type="text"
                    name="alt"
                    placeholder="Testo alternativo"
                    value={newMedia.alt}
                    onChange={handleNewMediaChange}
                    className="w-full border rounded px-2 py-1"
                  />
                  <textarea
                    name="description"
                    placeholder="Descrizione"
                    value={newMedia.description}
                    onChange={handleNewMediaChange}
                    className="w-full border rounded px-2 py-1"
                    required
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="submit" className="text-white border-primary-tan" disabled={submitting}>
                      Carica
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setAddingNew(false)}>
                      Annulla
                    </Button>
                  </div>
                  {formState?.error && <div className="text-red-500 text-sm mt-2">{formState.error}</div>}
                  {formState?.success && <div className="text-green-600 text-sm mt-2">Media caricato!</div>}
                </CardContent>
              </Card>
            </form>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Button
                variant="outline"
                className="w-full h-60 text-4xl font-bold text-primary-tan border-2 border-primary-tan hover:bg-primary-tan/10"
                aria-label="Aggiungi nuovo media"
                onClick={() => setAddingNew(true)}
              >
                +
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  )
} 