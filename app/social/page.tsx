"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

// Social media data with icons
const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/gio_frizzer?igsh=MWtkdmt1YzI4NXFvdQ==",
    icon: "📸",
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/giovanna.frigo.7",
    icon: "📘",
    color: "bg-gradient-to-r from-blue-600 to-blue-700"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/giovanna-frigo-038405264?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: "💼",
    color: "bg-gradient-to-r from-blue-500 to-blue-800"
  },
  {
    name: "Vinted",
    url: "https://www.vinted.it/member/54669180-giofrigo",
    icon: "💰",
    color: "bg-gradient-to-r from-green-500 to-green-700"
  }
]

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-pink via-white to-primary-tan">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-gray-900">
              I Miei Social
            </h1>
            <p className="text-xl text-gray-700 font-inter">
              Seguimi sui social media per rimanere aggiornato sui miei lavori
            </p>
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className={`${social.color} p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group-hover:bg-opacity-90`}>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{social.icon}</span>
                    <div className="text-left">
                      <h3 className="text-2xl font-playfair font-bold text-white">
                        {social.name}
                      </h3>
                      <p className="text-white/80 font-inter">
                        Seguimi su {social.name}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Back Button */}
          <div className="pt-8">
            <Button
              asChild
              className="px-8 py-4 text-lg bg-primary-tan hover:bg-primary-tan/90 text-white rounded-full shadow-lg"
            >
              <Link href="/">Torna alla Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 