import { streamText, convertToModelMessages, type UIMessage, consumeStream } from "ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { searchNASAStudies } from "@/lib/nasa-api"
import { createGroq } from "@ai-sdk/groq"

export const maxDuration = 30

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

const LEARNER_SYSTEM_PROMPT = `You are 'Astro-Bio-AI', an expert in NASA space biology and life sciences research. Your role is to educate and inspire a 'Learner' audience about real NASA space biology experiments and discoveries.

CONSTRAINTS:
1. **Tone:** Enthusiastic, highly encouraging, and simplify complex scientific concepts for easy comprehension (K-12 to undergraduate level).
2. **Data Source:** You have access to NASA's Open Science Data Repository (OSDR) containing real space biology experiments conducted on the ISS and other missions. Reference actual studies when possible.
3. **Response Format:** Use clear explanations, bullet points, and simple analogies. Keep responses concise but informative.
4. **Goal:** Inspire curiosity about space life sciences and future human missions to Mars and the Moon.

Key Topics You Can Discuss:
- How plants grow in microgravity (Veggie experiments, Arabidopsis studies)
- Effects of spaceflight on human health (bone density, muscle loss, immune system, cardiovascular changes)
- Microbial behavior in space (biofilms, bacterial growth, extremophiles)
- Radiation effects on living organisms and DNA
- Animal model studies (mice, fruit flies) on the ISS
- Cell culture experiments in space
- Future applications for Mars missions and lunar habitats

Remember to:
- Use encouraging language like "Great question!", "That's fascinating!", "Let me explain..."
- Break down complex topics into digestible pieces
- Use analogies that relate to everyday experiences
- Highlight the "wow factor" of space biology discoveries
- Connect findings to future space exploration goals
- Reference real NASA experiments when relevant`

export async function POST(req: Request) {
  console.log(" Learner chat API called")

  try {
    const session = await getServerSession(authOptions)
    console.log(" Session:", session ? "exists" : "null", session?.user?.role)

    if (!session?.user) {
      console.log(" Unauthorized - no session")
      return new Response("Unauthorized - Please sign in", { status: 401 })
    }

    if (session.user.role !== "Learner") {
      console.log(" Forbidden - wrong role:", session.user.role)
      return new Response("Forbidden - This endpoint is for Learners only", { status: 403 })
    }

    const { messages }: { messages: UIMessage[] } = await req.json()
    console.log(" Received messages:", messages.length)

    const modelMessages = convertToModelMessages(messages)
    console.log(" Converted to model messages:", modelMessages.length)

    // Extract last user message for NASA context search
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()
    const lastMessageText = lastUserMessage?.parts.find((p) => p.type === "text")?.text || ""
    console.log(" Last user message:", lastMessageText)

    let enhancedSystemPrompt = LEARNER_SYSTEM_PROMPT

    // Try to fetch relevant NASA studies to provide context
    try {
      console.log(" Fetching NASA studies...")
      const searchResults = await searchNASAStudies({
        term: lastMessageText,
        size: 3,
      })
      console.log(" NASA studies found:", searchResults.studies.length)

      if (searchResults.studies.length > 0) {
        const studyContext = searchResults.studies
          .map((study) => `- ${study.title} (${study.identifier}): ${study.description.slice(0, 200)}...`)
          .join("\n")

        enhancedSystemPrompt += `\n\nRELEVANT NASA STUDIES FOR CONTEXT:\n${studyContext}\n\nUse these real studies to inform your answer when relevant.`
      }
    } catch (error) {
      console.error(" Error fetching NASA context:", error)
      // Continue without enhanced context
    }

    console.log(" Starting streamText with Groq...")
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: enhancedSystemPrompt,
      messages: modelMessages,  
      abortSignal: req.signal,
    })

    console.log(" Returning stream response...")
    return result.toUIMessageStreamResponse({
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error(" API route error:", error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
