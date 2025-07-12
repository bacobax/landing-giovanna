"use client"

import { useState } from "react"
import { GalleryContent } from "./gallery-content"
import { ReelsContent } from "./reels-content"
import { Grid3X3, Play } from "lucide-react"
import { Button } from "./ui/button"

export function UnifiedGallery() {
  const [viewMode, setViewMode] = useState<"gallery" | "reels">("reels")

  return (
    <section 
      id="gallery" 
      
      className="py-20 px-4 relative bg-wood-light"
      
    >
      {/* Overlay for better text readability */}
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className={`text-4xl md:text-5xl font-playfair font-bold drop-shadow-lg text-gray-900`}>
            Opere
          </h2>
          <p className={`text-lg max-w-3xl mx-auto drop-shadow-md text-gray-700`}>
            Esplora le mie opere attraverso diverse esperienze visive
          </p>
          
          {/* View Toggle */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant={viewMode === "gallery" ? "default" : "outline"}
              onClick={() => setViewMode("gallery")}
              className={`flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border-gray-600`}
            >
              <Grid3X3 size={20} />
              <span>Galleria</span>
            </Button>
            <Button
              variant={viewMode === "reels" ? "default" : "outline"}
              onClick={() => setViewMode("reels")}
              className={`flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border-gray-600`}
            >
              <Play size={20} />
              <span>Reels</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out">
          {viewMode === "gallery" ? (
            <div>
              <GalleryContent />
            </div>
          ) : (
            <div>
              <ReelsContent />
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 