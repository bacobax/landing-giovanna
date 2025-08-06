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
              className={`flex items-center space-x-2 px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                viewMode === "gallery" 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl" 
                  : "bg-white/80 hover:bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg"
              }`}
            >
              <Grid3X3 size={20} />
              <span className="font-medium">Galleria</span>
            </Button>
            <Button
              variant={viewMode === "reels" ? "default" : "outline"}
              onClick={() => setViewMode("reels")}
              className={`flex items-center space-x-2 px-6 py-3 transition-all duration-300 transform hover:scale-105 ${
                viewMode === "reels" 
                  ? "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl" 
                  : "bg-white/80 hover:bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg"
              }`}
            >
              <Play size={20} />
              <span className="font-medium">Reels</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out">
          <div className={viewMode === "gallery" ? "" : "hidden"}>
            <GalleryContent />
          </div>
          <div className={viewMode === "reels" ? "" : "hidden"}>
            <ReelsContent isActive={viewMode === "reels"} />
          </div>
        </div>
      </div>
    </section>
  )
}