// app/api/nasa/test/route.ts
import { NextResponse } from "next/server";
import { searchNASAImages } from "@/lib/nasa-images";

export async function GET() {
  try {
    const testImage = await searchNASAImages("apollo 11");
    return NextResponse.json({
      success: true,
      testImage,
      message: testImage ? "NASA API is working!" : "NASA API returned no images"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}