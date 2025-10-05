// app/api/query/researcher/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  searchNASAStudies,
  mapBiologicalSystemToOrganism,
} from "@/lib/nasa-api";
import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

let groq: ReturnType<typeof createGroq> | null = null;
try {
  groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
  });
} catch (error) {
  console.error(" Failed to initialize Groq:", error);
}

const ResultAnalysisSchema = z.object({
  rankedResults: z.array(
    z.object({
      identifier: z.string(),
      relevanceScore: z.number().min(0).max(1),
      keyFindings: z.string(),
      reasoning: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log(" Session check:", {
      hasSession: !!session,
      role: session?.user?.role,
    });

    if (!session?.user) {
      console.log(" Unauthorized - no session");
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    if (session.user.role !== "Researcher") {
      console.log(" Forbidden - user is not a Researcher");
      return NextResponse.json(
        { error: "Forbidden - This endpoint is for Researchers only" },
        { status: 403 }
      );
    }

    const { biologicalSystem, yearRange, query } = await req.json();
    console.log(" Researcher query received:", {
      biologicalSystem,
      yearRange,
      query,
    });

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const organism =
      biologicalSystem && biologicalSystem !== "all"
        ? mapBiologicalSystemToOrganism(biologicalSystem)
        : undefined;

    console.log(" Searching NASA OSDR with:", { term: query, organism });

    let searchResults;
    try {
      searchResults = await searchNASAStudies({
        term: query,
        organism,
        size: 20,
      });
      console.log(
        " NASA API returned",
        searchResults.hits,
        "total hits,",
        searchResults.studies.length,
        "studies"
      );
    } catch (nasaError) {
      console.error(" NASA API call failed:", nasaError);
      return NextResponse.json(
        {
          error: `NASA API Error: ${
            nasaError instanceof Error ? nasaError.message : "Unknown error"
          }`,
          details:
            "The NASA OSDR API may be unavailable. Please try again later.",
        },
        { status: 500 }
      );
    }

    if (searchResults.studies.length === 0) {
      console.log(" No studies found in NASA API response");
      return NextResponse.json({
        results: [],
        message:
          "No studies found. The NASA API returned 0 results for your query.",
      });
    }

    let filteredStudies = searchResults.studies;
    if (yearRange && yearRange !== "all") {
      const originalCount = filteredStudies.length;
      if (yearRange.includes("-")) {
        const [startYear, endYear] = yearRange.split("-").map(Number);
        filteredStudies = filteredStudies.filter((study) => {
          if (!study.publicReleaseDate) return false;
          const year = new Date(study.publicReleaseDate).getFullYear();
          return year >= startYear && year <= endYear;
        });
      } else {
        const targetYear = Number(yearRange);
        filteredStudies = filteredStudies.filter((study) => {
          if (!study.publicReleaseDate) return false;
          const year = new Date(study.publicReleaseDate).getFullYear();
          return year === targetYear;
        });
      }
      console.log(
        " Filtered by year:",
        originalCount,
        "->",
        filteredStudies.length
      );
    }

    if (filteredStudies.length === 0) {
      console.log(" No studies after year filtering");
      return NextResponse.json({ results: [] });
    }

    if (groq && process.env.GROQ_API_KEY) {
      try {
        const studiesContext = filteredStudies
          .slice(0, 10)
          .map(
            (study, idx) =>
              `Study ${idx + 1}:
ID: ${study.identifier}
Title: ${study.title}
Description: ${study.description.slice(0, 500)}
Organism: ${study.organism || "Unknown"}
Project Type: ${study.projectType || "Unknown"}`
          )
          .join("\n\n");

        console.log(" Analyzing studies with Groq AI...");

        const { object: analysis } = await generateObject({
          model: groq("llama-3.3-70b-versatile"),
          schema: ResultAnalysisSchema,
          prompt: `You are a NASA space biology research analyst. Analyze these studies and rank them by relevance to the researcher's query.

Researcher Query: "${query}"
Biological System Filter: ${biologicalSystem || "All"}

Studies to analyze:
${studiesContext}

For each study, provide:
1. A relevance score (0-1) based on how well it matches the query
2. Key findings extracted from the description
3. Brief reasoning for the relevance score

Return results ranked by relevance score (highest first). Only include studies with relevance > 0.3.`,
        });

        console.log(
          " AI analysis complete, found",
          analysis.rankedResults.length,
          "ranked results"
        );

        const results = analysis.rankedResults
          .map((aiResult) => {
            const study = filteredStudies.find(
              (s) => s.identifier === aiResult.identifier
            );
            if (!study) return null;

            return {
              title: study.title,
              experimentId: study.identifier,
              year: study.publicReleaseDate
                ? new Date(study.publicReleaseDate).getFullYear()
                : 0,
              system: study.organism || biologicalSystem || "Unknown",
              summary: aiResult.keyFindings || study.description.slice(0, 300),
              relevance: aiResult.relevanceScore,
              projectType: study.projectType,
              managingCenter: study.managingNASACenter,
              reasoning: aiResult.reasoning,
              studyUrl: study.studyUrl,
              dataUrl: study.dataUrl,
            };
          })
          .filter((r) => r !== null)
          .slice(0, 10);

        console.log(" Returning", results.length, "AI-ranked results");
        return NextResponse.json({ results });
      } catch (aiError) {
        console.error(
          " AI analysis failed, falling back to keyword matching:",
          aiError
        );
        // Fall through to keyword matching
      }
    }

    console.log(" Using keyword-based ranking (AI not available)");
    const queryTerms = query.toLowerCase().split(/\s+/);

    const results = filteredStudies
      .map((study) => {
        const searchText = `${study.title} ${study.description} ${
          study.organism || ""
        } ${study.projectType || ""}`.toLowerCase();

        const matchCount = queryTerms.filter((term: any) =>
          searchText.includes(term)
        ).length;
        const relevance = matchCount / queryTerms.length;

        return {
          title: study.title,
          experimentId: study.identifier,
          year: study.publicReleaseDate
            ? new Date(study.publicReleaseDate).getFullYear()
            : 0,
          system: study.organism || biologicalSystem || "Unknown",
          summary: study.description.slice(0, 300),
          relevance,
          projectType: study.projectType,
          managingCenter: study.managingNASACenter,
          studyUrl: study.studyUrl,
          dataUrl: study.dataUrl,
        };
      })
      .filter((r) => r.relevance > 0.2)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 10);

    console.log(" Returning", results.length, "keyword-ranked results");
    return NextResponse.json({ results });
  } catch (error) {
    console.error(" Error in researcher query:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process query. Please try again.",
      },
      { status: 500 }
    );
  }
}