"use client"

import type React from "react"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Microscope } from "lucide-react"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [demoEmail, setDemoEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user has a role
      if (session.user.role) {
        router.push("/dashboard")
      } else {
        router.push("/role-select")
      }
    }
  }, [status, session, router])

  const handleDemoSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!demoEmail) return

    setIsLoading(true)
    try {
      await signIn("demo", {
        email: demoEmail,
        callbackUrl: "/role-select",
      })
    } catch (error) {
      console.error("Demo sign-in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen space-grid flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-grid flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto cosmic-glow">
            <Microscope className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl">Welcome to BioVerse</CardTitle>
          <CardDescription className="text-base">
            Sign in to access NASA's Space Biology Knowledge Engine
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDemoSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-email">Demo Account</Label>
              <Input
                id="demo-email"
                type="email"
                placeholder="Enter any email (e.g., demo@nasa.gov)"
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">Use any email to explore the app. No password required.</p>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Continue with Demo Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/role-select" })}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Google OAuth requires <code className="text-xs">GOOGLE_CLIENT_ID</code> and{" "}
            <code className="text-xs">GOOGLE_CLIENT_SECRET</code> environment variables
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
