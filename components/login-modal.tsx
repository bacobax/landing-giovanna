"use client";
import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    startTransition(async () => {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Credenziali non valide.");
        console.log({res}); 
      } else if (res?.ok) {
        onClose();
        // Optionally, refresh the page or session here
      }
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm font-inter">
      <Card className="w-full max-w-sm relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
          onClick={onClose}
          aria-label="Chiudi"
          type="button"
        >
          ×
        </button>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="username"
              placeholder="Username"
              autoComplete="username"
              disabled={isPending}
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="current-password"
              disabled={isPending}
            />
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease;
          }
        `}</style>
      </Card>
    </div>
  );
};
