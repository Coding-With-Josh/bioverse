"use client"

import DashboardHeader from "./dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, BookOpen, TrendingUp } from "lucide-react"
import LearnerChat from "@/components/chat/learner-chat"

interface LearnerDashboardProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: "Learner" | "Researcher" | null
  }
}

export default function LearnerDashboard({ user }: LearnerDashboardProps) {
  return (
    <>
      <DashboardHeader user={user} />

      <main className="container w-screen mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Welcome back, {user.name?.split(" ")[0] || "Explorer"}!</h2>
            <p className="text-lg text-muted-foreground">Ready to explore the fascinating world of space biology?</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Discoveries</CardTitle>
                <Sparkles className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">Key findings available</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Paths</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Curated topics to explore</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Studies</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43</div>
                <p className="text-xs text-muted-foreground">Published this year</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-accent" />
                Astro-Bio-AI Knowledge Engine
              </CardTitle>
              <CardDescription>
                Ask me anything about space biology! I'm here to help you learn about life in space.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LearnerChat />
            </CardContent>
          </Card>

          {/* Featured Topics */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Featured Topics</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Astronaut Health in Microgravity</CardTitle>
                  <CardDescription>
                    Learn about the challenges astronauts face and how scientists are working to keep them healthy
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Plants in Space?</CardTitle>
                  <CardDescription>
                    Learn about the cway plants grow in space and what they need to make growth possible
                  </CardDescription>
                </CardHeader>
              </Card>
              {/* <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Astronaut Health in Microgravity</CardTitle>
                  <CardDescription>
                    Learn about the challenges astronauts face and how scientists are working to keep them healthy
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Astronaut Health in Microgravity</CardTitle>
                  <CardDescription>
                    Learn about the challenges astronauts face and how scientists are working to keep them healthy
                  </CardDescription>
                </CardHeader>
              </Card> */}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
