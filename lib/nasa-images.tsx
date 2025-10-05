// lib/nasa-images.ts

interface NASAImageSearchResult {
  collection: {
    items: Array<{
      data: Array<{
        title: string;
        description: string;
        keywords: string[];
        nasa_id: string;
        media_type: string;
        date_created: string;
      }>;
      links?: Array<{
        href: string;
        rel: string;
        render: string;
      }>;
    }>;
    metadata: {
      total_hits: number;
    };
  };
}

// Simple in-memory cache
const imageCache = new Map<string, string>();

export async function searchNASAImages(
  query: string,
  mediaType: "image" | "video" | "audio" = "image"
): Promise<string | null> {
  const cacheKey = `${query}-${mediaType}`;
  
  // Check cache first
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) || null;
  }

  try {
    console.log("🔍 NASA Images API - Searching for:", query);

    // Build the search URL with proper encoding
    const params = new URLSearchParams({
      q: query.trim(),
      media_type: mediaType,
      page_size: "5",
    });

    const url = `https://images-api.nasa.gov/search?${params.toString()}`;
    console.log("🌐 NASA Images API - URL:", url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NASA-Research-App/1.0'
      },
    });

    console.log("📡 NASA Images API - Response status:", response.status);

    if (!response.ok) {
      console.error("❌ NASA Images API - HTTP Error:", response.status, response.statusText);
      
      // Try to read the error response as text to see what's wrong
      const errorText = await response.text();
      console.error("❌ NASA Images API - Error response:", errorText.substring(0, 200));
      
      return null;
    }

    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error("❌ NASA Images API - Unexpected content type:", contentType);
      const text = await response.text();
      console.error("❌ NASA Images API - Response text:", text.substring(0, 200));
      return null;
    }

    const data: NASAImageSearchResult = await response.json();
    
    console.log("✅ NASA Images API - Total hits:", data.collection.metadata.total_hits);
    console.log("✅ NASA Images API - Items found:", data.collection.items?.length || 0);

    let bestImageUrl: string | null = null;

    // Look for the best image
    if (data.collection.items && data.collection.items.length > 0) {
      for (const item of data.collection.items) {
        if (item.links && item.links.length > 0) {
          console.log("🔗 NASA Images API - Links found:", item.links.length);
          
          // Prefer preview images
          const previewLink = item.links.find((link) => link.rel === "preview");
          if (previewLink) {
            console.log("📸 NASA Images API - Found preview link:", previewLink.href);
            if (isValidImage(previewLink.href)) {
              bestImageUrl = previewLink.href;
              break;
            }
          }

          // Fallback to any image link
          const imageLink = item.links.find((link) => 
            link.render === "image" || (link.href && link.href.match(/\.(jpg|jpeg|png|gif|webp)$/i))
          );
          if (imageLink && isValidImage(imageLink.href)) {
            console.log("🖼️ NASA Images API - Found image link:", imageLink.href);
            bestImageUrl = imageLink.href;
            break;
          }
        }
      }
    }

    // Cache the result
    if (bestImageUrl) {
      imageCache.set(cacheKey, bestImageUrl);
      console.log("✅ NASA Images API - Image found and cached");
    } else {
      console.log("❌ NASA Images API - No suitable image found");
    }

    return bestImageUrl;
  } catch (error) {
    console.error("💥 NASA Images API - Fetch error:", error);
    return null;
  }
}

function isValidImage(url: string): boolean {
  if (!url) return false;
  
  // Filter out very small images or invalid URLs
  if (url.includes('thumb') || url.includes('icon') || url.includes('~thumb')) {
    return false;
  }
  
  // Check for common image extensions
  const hasImageExtension = /\.(jpg|jpeg|png|gif|webp)($|\?)/i.test(url);
  
  // Also accept URLs that don't have extensions but are from NASA assets
  const isNASAAsset = url.includes('images-assets.nasa.gov');
  
  return hasImageExtension || isNASAAsset;
}