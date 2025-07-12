import type React from "react"
import "./globals.css"
import { Playfair_Display, Inter } from "next/font/google"

// Configure Playfair Display for elegant headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

// Configure Inter for minimal and accessible body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata = {
  title: "Artist Showcase",
  description: "A showcase of artistic crafts and paintings.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
