import fs from 'fs'
import path from 'path'

export interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  description: string
  medium: string
  year: string
}

export function getGalleryImages(): GalleryImage[] {
  const assetsDir = path.join(process.cwd(), 'public/assets')
  
  try {
    const files = fs.readdirSync(assetsDir)
    const imageFiles = files.filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg')
    )
    
    return imageFiles.map((file, index) => {
      const baseName = path.parse(file).name
      const imageNumber = index + 1
      
      return {
        id: `artwork-${imageNumber}`,
        src: `/assets/${file}`,
        alt: `Artwork ${imageNumber} - ${baseName}`,
        title: `Artistic Creation ${imageNumber}`,
        description: `A beautiful piece showcasing unique artistic expression and creative vision.`,
        medium: "Mixed media",
        year: "2024"
      }
    })
  } catch (error) {
    console.error('Error reading gallery images:', error)
    return []
  }
} 