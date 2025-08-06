"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!open) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    startTransition(async () => {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })
      if (res?.error) {
        setError("Credenziali non valide.")
      } else if (res?.ok) {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-sm">
        <Button
          variant="ghost"
          className="absolute right-2 top-2" 
          onClick={onClose}
        >
          ×
        </Button>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
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
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Accesso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
