"use client"

import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

interface FooterSectionProps {
  onAdminClick: () => void;
}

export function FooterSection({ onAdminClick }: FooterSectionProps) {
  return (
    <footer className="py-8 px-4 text-center text-gray-600 text-sm bg-white-shade relative flex flex-col sm:flex-row sm:justify-between">
      <p>&copy; {new Date().getFullYear()} Artist Name. All rights reserved.</p>
      <div className="w-full h-full flex items-center justify-center sm:justify-end">
        <Button
          variant="ghost"
          size="sm"
          className=" text-gray-400 hover:text-gray-700"
          onClick={onAdminClick}
          aria-label="Admin login"
        >
          Admin
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className=" text-gray-400 hover:text-gray-700"
          onClick={() => signOut()}
          aria-label="Logout"
        >
          Logout
        </Button>
      </div>
      
    </footer>
  )
}