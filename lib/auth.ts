import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

let GoogleProvider: any = null
try {
  GoogleProvider = require("next-auth/providers/google").default
  console.log(" GoogleProvider loaded successfully")
} catch (error) {
  console.log(" GoogleProvider failed to load:", error)
}

const buildProviders = () => {
  const providers: any[] = []

  // Add Google OAuth if credentials are available and provider loaded
  if (GoogleProvider && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    try {
      providers.push(
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      )
      console.log(" Google OAuth provider added")
    } catch (error) {
      console.log(" Failed to add Google provider:", error)
    }
  }

  // Always add demo credentials provider as fallback
  providers.push(
    CredentialsProvider({
      id: "demo",
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@nasa.gov" },
      },
      async authorize(credentials) {
        console.log(" Demo auth attempt:", credentials?.email)
        if (credentials?.email) {
          return {
            id: `demo-${Date.now()}`,
            email: credentials.email,
            name: credentials.email.split("@")[0],
          }
        }
        return null
      },
    }),
  )

  console.log(" Total providers configured:", providers.length)
  return providers
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "nasa-bio-frontier-secret-key-change-in-production",
  providers: buildProviders(),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.role = null
        console.log(" JWT created for user:", user.email)
      }

      // Handle session updates (when role is set)
      if (trigger === "update" && session?.role) {
        token.role = session.role
        console.log(" Role updated in JWT:", session.role)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as "Learner" | "Researcher" | null
      }
      return session
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  debug: true,
}
