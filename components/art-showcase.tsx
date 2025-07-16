"use client"

import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { ContactSection } from "./contact-section"
import { FooterSection } from "./footer-section"
import { CursorFollower } from "./cursor-follower"
import { UnifiedGallery } from "./unified-gallery"
import { useEffect, useState } from "react"
import { LoginModal } from "./login-modal";
import { SessionProvider } from "next-auth/react"

export function ArtShowcase() {
  const [isMobile, setIsMobile] = useState(false)
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const isSmallScreen = window.innerWidth <= 768
      setIsMobile(isTouchDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return (
    <SessionProvider>
      <div className="min-h-screen bg-white-shade font-inter text-gray-800">
        {!isMobile && <CursorFollower />}
        <HeroSection />
      <AboutSection />
      <UnifiedGallery />
      <ContactSection />
      <FooterSection onAdminClick={() => setShowModal(true)} />

      {/* Sono Gio Button */}
      {/* Login Modal */}
        <LoginModal open={showModal} onClose={() => setShowModal(false)} />
      </div>
    </SessionProvider>
  )
}
