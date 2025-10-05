// app/api/nasa/images/route.ts

import { NextResponse } from "next/server";
import { searchNASAImages } from "@/lib/nasa-images";

export async function POST(req: Request) {
  try {
    const { query, keywords } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    console.log("🚀 NASA Images API Route - Received query:", query);
    console.log("🔑 NASA Images API Route - Keywords:", keywords);

    let imageUrl: string | null = null;

    // Try the main query first
    try {
      imageUrl = await searchNASAImages(query);
      console.log("✅ NASA Images API Route - Main query result:", imageUrl ? "SUCCESS" : "NO IMAGE");
    } catch (error) {
      console.error("❌ NASA Images API Route - Main query failed:", error);
    }

    // If no results, try with keywords
    if (!imageUrl && keywords && keywords.length > 0) {
      console.log("🔄 NASA Images API Route - Trying keywords...");
      for (const keyword of keywords.slice(0, 3)) {
        if (keyword && keyword.length > 2) {
          try {
            imageUrl = await searchNASAImages(keyword);
            if (imageUrl) {
              console.log("✅ NASA Images API Route - Keyword success with:", keyword);
              break;
            }
          } catch (error) {
            console.error("❌ NASA Images API Route - Keyword search failed for:", keyword, error);
          }
        }
      }
    }

    // Fallback to space research images
    if (!imageUrl) {
      console.log("🔄 NASA Images API Route - Trying fallback...");
      try {
        imageUrl = await searchNASAImages("space biology research");
      } catch (error) {
        console.error("❌ NASA Images API Route - Fallback failed:", error);
      }
    }

    // Ultimate fallback
    if (!imageUrl) {
      console.log("🔄 NASA Images API Route - Trying ultimate fallback...");
      try {
        imageUrl = await searchNASAImages("NASA");
      } catch (error) {
        console.error("❌ NASA Images API Route - Ultimate fallback failed:", error);
      }
    }

    console.log("🎯 NASA Images API Route - Final result:", imageUrl ? "IMAGE FOUND" : "NO IMAGE");

    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl || null,
      queryUsed: query
    });
    
  } catch (error) {
    console.error("💥 NASA Images API Route - Top level error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch NASA images",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}