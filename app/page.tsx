import { Hero } from "../components/hero"
import Navbar from "../components/navbar"
import {Particles} from "@/components/ui/sparkles"

export default function LandingPage() {
  return (
    <div className="min-h-screen space-grid relative">
      <Navbar/>
      <Hero/>
      
    </div>
  )
}
