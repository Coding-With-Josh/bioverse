import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import LearnerDashboard from "@/components/dashboard/learner-dashboard"
import ResearcherDashboard from "@/components/dashboard/researcher-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/sign-in")
  }

  if (!session.user.role) {
    redirect("/role-select")
  }

  return (
    <div className="min-h-screen space-grid">
      {session.user.role === "Learner" ? (
        <LearnerDashboard user={session.user} />
      ) : (
        <ResearcherDashboard user={session.user} />
      )}
    </div>
  )
}
