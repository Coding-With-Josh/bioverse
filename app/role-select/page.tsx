"use client"

import { useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Microscope } from "lucide-react"
import { redirect } from "next/navigation"

export default function RoleSelectPage() {
  const { data: session, update } = useSession()
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = async (role: "Learner" | "Researcher") => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      if (response.ok) {
        await update({ role })
        redirect("/dashboard")
      }
    } catch (error) {
      console.error("Error setting role:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    redirect("/sign-in")
    return null
  }

  if (session.user?.role) {
    redirect("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen space-grid flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold">Choose Your Path</h1>
          <p className="text-lg text-muted-foreground">
            Select how you'd like to explore NASA's space biology research
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all hover:scale-[1.02] cursor-pointer group">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Learner</CardTitle>
                <CardDescription className="text-base">
                  Perfect for students, educators, and space enthusiasts who want to explore and learn about space
                  biology in an accessible way.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Conversational AI that explains complex concepts simply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Curated learning paths and featured discoveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Engaging content designed for education</span>
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelect("Learner")}
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                Continue as Learner
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:scale-[1.02] cursor-pointer group">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Microscope className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Researcher</CardTitle>
                <CardDescription className="text-base">
                  Designed for scientists, academics, and professionals who need structured access to research data and
                  publications.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Advanced query interface for precise data extraction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Access to full publications and experimental data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Structured results with relevance scoring</span>
                </li>
              </ul>
              <Button
                onClick={() => handleRoleSelect("Researcher")}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Continue as Researcher
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
