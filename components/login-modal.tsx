"use client";
import React, { useState, useTransition } from "react";
import { signIn } from "next-auth/react";

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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-200 font-inter">
      <div className="bg-white-shade p-8 shadow-2xl w-full max-w-sm border border-gray-200 text-gray-800 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full"
          onClick={onClose}
          aria-label="Chiudi"
          type="button"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-800 placeholder-gray-400 transition"
            autoComplete="username"
            disabled={isPending}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white text-gray-800 placeholder-gray-400 transition"
            autoComplete="current-password"
            disabled={isPending}
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease;
          }
        `}</style>
      </div>
    </div>
  );
}; 