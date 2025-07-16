"use client"

import { Button } from "./ui/button";

interface FooterSectionProps {
  onAdminClick: () => void;
}

export function FooterSection({ onAdminClick }: FooterSectionProps) {
  return (
    <footer className="py-8 px-4 text-center text-gray-600 text-sm bg-white-shade relative">
      <p>&copy; {new Date().getFullYear()} Artist Name. All rights reserved.</p>
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        onClick={onAdminClick}
        aria-label="Admin login"
      >
        Admin
      </Button>
    </footer>
  )
} 