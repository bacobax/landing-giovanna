"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronUp, ChevronDown, Play, Pause, ChevronUp as ExpandIcon, ChevronDown as CollapseIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface ReelMedia {
  id: string
  src: string
  alt: string
  title: string
  description: string
  medium: "image" | "video"
  show_reel?: boolean
  duration?: number // in seconds, for videos
}

export function ReelsContent() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({})
  const { data: session } = useSession()
  const [reelsMedia, setReelsMedia] = useState<ReelMedia[]>([])
  const [allMedia, setAllMedia] = useState<ReelMedia[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const fetchReels = async () => {
    const res = await fetch("/api/reel")
    const data = await res.json()
    setReelsMedia(data)
  }

  const fetchAllMedia = async () => {
    const [imgsRes, vidsRes] = await Promise.all([
      fetch("/api/image?all=1"),
      fetch("/api/video?all=1"),
    ])
    const [imgs, vids] = await Promise.all([imgsRes.json(), vidsRes.json()])
    setAllMedia([...imgs, ...vids])
  }

  const nextReel = useCallback(() => {
    if (reelsMedia.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % reelsMedia.length)
    setIsDescriptionExpanded(false)
  }, [reelsMedia.length])

  const previousReel = useCallback(() => {
    if (reelsMedia.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + reelsMedia.length) % reelsMedia.length)
    setIsDescriptionExpanded(false)
  }, [reelsMedia.length])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    setIsAutoPlay(!isAutoPlay)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  useEffect(() => {
    setIsMounted(true)
    fetchReels()
  }, [])

  useEffect(() => {
    if (reelsMedia.length === 0) return
    // Preload all media to avoid delays when navigating
    reelsMedia.forEach((m) => {
      if (m.medium === "image") {
        const img = new window.Image()
        img.src = `/api/image/${m.id}`
      } else {
        const video = document.createElement("video")
        video.src = `/api/video/${m.id}`
        video.preload = "auto"
      }
    })
  }, [reelsMedia])

  useEffect(() => {
    if (!isMounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault()
        nextReel()
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        previousReel()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMounted, nextReel, previousReel])

  useEffect(() => {
    // Auto-advance every 5 seconds if autoplay is enabled
    if (isAutoPlay && isMounted) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reelsMedia.length)
        setIsDescriptionExpanded(false) // Reset expansion on auto-advance
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [isAutoPlay, reelsMedia.length, isMounted, currentIndex, reelsMedia])

  useEffect(() => {
    // Handle video playback
    if (!isMounted || reelsMedia.length === 0) return

    const currentVideo = videoRefs.current[reelsMedia[currentIndex].id]
    if (currentVideo && reelsMedia[currentIndex].medium === "video") {
      if (isPlaying) {
        // Use a more robust approach to handle video playback
        const playPromise = currentVideo.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Video play failed:", error)
            setVideoError("Video playback was interrupted. This is normal behavior to save power.")
            // Don't throw error, just log it
          })
        }
      } else {
        currentVideo.pause()
      }
    }
    
    // Clear video error and loading state when changing media
    setVideoError(null)
    setVideoLoading(false)
  }, [currentIndex, isPlaying, isMounted, reelsMedia])

  const currentMedia = reelsMedia[currentIndex]
  const isDescriptionLong = currentMedia ? currentMedia.description.length > 150 : false

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex justify-center py-12">
          <div className="text-gray-600">Caricamento reels...</div>
      </div>
    )
  }

  if (!currentMedia) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-600">Nessun media disponibile.</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {session && (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const open = !menuOpen
              setMenuOpen(open)
              if (open) fetchAllMedia()
            }}
          >
            Gestisci reels
          </Button>
        </div>
      )}
      <p className="text-lg text-center max-w-2xl mx-auto text-gray-700">
          Scorri attraverso il mio percorso artistico con questa esperienza visiva interattiva
      </p>
      
      <div 
        ref={containerRef}
        className="relative h-[80vh] max-h-[600px] w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Current Media Display */}
        <div className="relative w-full h-full">
          {currentMedia.medium === "image" ? (
            <Image
              src={`/api/image/${currentMedia.id}`}
              alt={currentMedia.alt}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <>
              <video
                ref={(el) => {
                  videoRefs.current[currentMedia.id] = el
                }}
                src={`/api/video/${currentMedia.id}`}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                controls={false}
                preload="metadata"
                onLoadStart={() => setVideoLoading(true)}
                onLoadedData={() => {
                  setVideoLoading(false)
                  const video = videoRefs.current[currentMedia.id]
                  if (video && isPlaying) {
                    video.play().catch(console.log)
                  }
                }}
                onError={(e) => {
                  console.log("Video error:", e)
                  setVideoLoading(false)
                  setVideoError("Impossibile caricare il video. Per favore, prova a ricaricare la pagina.")
                }}
              >
                <source src={`/api/video/${currentMedia.id}`} type="video/mp4" />
                Il tuo browser non supporta il tag video.
              </video>

              {/* Loading indicator */}
              {videoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-lg">Caricamento video...</div>
                </div>
              )}

              {/* Fallback for video errors */}
              {videoError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center p-4">
                    <div className="text-lg mb-2">Video non disponibile</div>
                    <div className="text-sm opacity-75">{videoError}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Overlay with media info - now with expandable description */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white transition-all duration-300 ${
            isDescriptionExpanded ? 'h-full' : ''
          }`}>
            <div className={`transition-all duration-300 ${
              isDescriptionExpanded ? 'h-full flex flex-col justify-end' : ''
            }`}>
              <h3 className="text-xl font-semibold mb-2">{currentMedia.title}</h3>
              <div className="relative">
                <p className={`text-sm opacity-90 transition-all duration-300 ${
                  isDescriptionExpanded ? 'max-h-none' : 'max-h-16 overflow-hidden'
                }`}>
                  {isDescriptionExpanded ? currentMedia.description : truncateText(currentMedia.description)}
                </p>
                {isDescriptionLong && (
                  <button
                    onClick={toggleDescription}
                    className="mt-2 flex items-center text-xs text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        <CollapseIcon size={12} className="mr-1" />
                        Mostra meno
                      </>
                    ) : (
                      <>
                        <ExpandIcon size={12} className="mr-1" />
                        Leggi tutto
                      </>
                    )}
                  </button>
                )}
              </div>
              {videoError && currentMedia.medium === "video" && (
                <div className="mt-2 p-2 bg-yellow-500/80 rounded text-xs">
                  {videoError}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button
              onClick={togglePlayPause}
              className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="absolute top-4 left-4 right-4">
            <div className="flex space-x-1">
              {reelsMedia.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white"
                      : index < currentIndex
                      ? "bg-white/50"
                      : "bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={previousReel}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronUp size={24} />
          </button>
          <button
            onClick={nextReel}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 space-y-2">
        <p>Usa le frecce o clicca sui pulsanti per navigare</p>
        <p>Clicca sul pulsante play/pause per controllare l&apos;autoplay</p>
        <p className="text-xs">
          {currentIndex + 1} of {reelsMedia.length}
        </p>
      </div>
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg mb-4">Seleziona media da mostrare</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!uploadFile) return
                const form = new FormData()
                form.append("file", uploadFile)
                form.append("title", uploadFile.name)
                form.append("description", uploadFile.name)
                form.append("year", new Date().getFullYear().toString())
                form.append("show_reel", "true")
                form.append("reel_only", "true")
                const isVideo = uploadFile.type.startsWith("video")
                await fetch(isVideo ? "/api/video" : "/api/image", {
                  method: "POST",
                  body: form,
                })
                setUploadFile(null)
                await fetchReels()
                await fetchAllMedia()
              }}
              className="mb-4 space-y-2"
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
              <Button type="submit" size="sm" disabled={!uploadFile}>
                Carica nuovo media
              </Button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allMedia.map((m) => (
                <label key={m.id} className="flex flex-col items-center">
                  {m.medium === "image" ? (
                    <Image
                      src={`/api/image/${m.id}`}
                      alt={m.alt}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={`/api/video/${m.id}`}
                      className="w-[100px] h-[100px] object-cover"
                      muted
                      loop
                      playsInline
                    />
                  )}
                  <input
                    type="checkbox"
                    className="mt-2"
                    checked={m.show_reel === true}
                    onChange={async (e) => {
                      await fetch(`/api/reel/${m.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ show_reel: e.target.checked }),
                      })
                      await fetchReels()
                      setAllMedia((prev) =>
                        prev.map((item) =>
                          item.id === m.id ? { ...item, show_reel: e.target.checked } : item
                        )
                      )
                    }}
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 text-right">
              <Button size="sm" onClick={() => setMenuOpen(false)}>
                Chiudi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}