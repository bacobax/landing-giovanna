"use client"

import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { ContactSection } from "./contact-section"
import { FooterSection } from "./footer-section"
import { CursorFollower } from "./cursor-follower"
import { UnifiedGallery } from "./unified-gallery"

export function ArtShowcase() {
  return (
    <div className="min-h-screen bg-white-shade font-inter text-gray-800">
      <CursorFollower />
      <HeroSection />
      <AboutSection />
      <UnifiedGallery />
      <ContactSection />
      <FooterSection />
    </div>
  )
}
