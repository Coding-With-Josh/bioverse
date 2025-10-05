import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, Microscope, Globe } from "lucide-react"
import { HeroContent } from "@/components/hero-content"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen space-grid relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src={require("@/assets/abstract-space-biology-visualization-with-dna-heli.jpg")}
          alt="Space biology background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      {/* </CHANGE> */}

      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
           <Image src={require("@/assets/logo.png")} alt="Logo" width={40} />
            <span className="font-mono text-sm text-muted-foreground">NASA Bio-Frontier</span>
          </div>
          <Link href="/sign-in">
            <Button size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <HeroContent />
      </section>

      {/* Feature Cards */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Human Health Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Human Health</CardTitle>
              <CardDescription className="text-base">
                Understanding the impact of microgravity and radiation on the human body
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Explore decades of research on astronaut health, bone density loss, muscle atrophy, and cardiovascular
                changes in space. Critical data for long-duration missions to Mars and beyond.
              </p>
            </CardContent>
          </Card>

          {/* Plant & Microbe Life Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Plant & Microbe Life</CardTitle>
              <CardDescription className="text-base">Experiments on cultivating life beyond Earth</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover how plants grow in microgravity, microbial behavior in space environments, and the potential
                for sustainable food production on lunar and Martian habitats.
              </p>
            </CardContent>
          </Card>

          {/* Future Exploration Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-secondary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-2xl">Future Exploration</CardTitle>
              <CardDescription className="text-base">Informing missions to the Moon and Mars</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Access the foundational research that shapes humanity's next giant leap. From radiation shielding to
                closed-loop life support systems for deep space missions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-24">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">Built by the Idia Innovators @ NASA SpaceApps Challenge. Powered by NASA Space Biology Research</p>
        </div>
      </footer>
    </div>
  )
}
