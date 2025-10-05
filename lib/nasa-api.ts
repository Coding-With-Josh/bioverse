// NASA Open Science Data Repository (OSDR) API Service

const NASA_API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";
const NASA_BASE_URL = "https://osdr.nasa.gov";

export interface NASAStudy {
  identifier: string;
  title: string;
  description: string;
  publicReleaseDate: string;
  organism?: string;
  studyAssayTechnologyType?: string;
  studyFactorName?: string;
  projectType?: string;
  managingNASACenter?: string;
}

export interface NASASearchResult {
  hits: number;
  studies: NASAStudy[];
}

/**
 * Search NASA OSDR for space biology studies
 */
export async function searchNASAStudies(params: {
  term?: string;
  organism?: string;
  assayType?: string;
  from?: number;
  size?: number;
}): Promise<NASASearchResult> {
  const { term = "", organism, assayType, from = 0, size = 25 } = params;

  console.log(" NASA API - Search params:", params);

  // Build query parameters
  const queryParams = new URLSearchParams({
    term: term || "space biology",
    from: from.toString(),
    size: size.toString(),
    type: "cgene",
  });

  // Add filters if provided
  if (organism) {
    queryParams.append("ffield", "organism");
    queryParams.append("fvalue", organism);
  }

  if (assayType) {
    queryParams.append("ffield", "Study Assay Technology Type");
    queryParams.append("fvalue", assayType);
  }

  const fullUrl = `${NASA_BASE_URL}/osdr/data/search?${queryParams.toString()}`;
  console.log(" NASA API - Full URL:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    console.log(" NASA API - Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(" NASA API - Error response:", errorText);
      throw new Error(`NASA API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    console.log(" NASA API - Response structure:", {
      hasHits: !!data.hits,
      hitsTotal: data.hits?.total,
      hitsCount: data.hits?.hits?.length,
      firstHitKeys: data.hits?.hits?.[0] ? Object.keys(data.hits.hits[0]) : [],
    });

    // Parse the response
    const studies: NASAStudy[] = [];

    if (data.hits && data.hits.hits) {
      for (const hit of data.hits.hits) {
        const source = hit._source || {};

        if (studies.length === 0) {
          console.log(
            " NASA API - First study source keys:",
            Object.keys(source)
          );
          console.log(" NASA API - First study sample:", {
            identifier: source["Study Identifier"] || source.Accession,
            title: source["Study Title"],
            hasDescription: !!source["Study Description"],
          });
        }

        studies.push({
          identifier:
            source["Study Identifier"] || source.Accession || "Unknown",
          title: source["Study Title"] || "Untitled Study",
          description:
            source["Study Description"] || "No description available",
          publicReleaseDate: source["Study Public Release Date"] || "",
          organism: source.organism || "",
          studyAssayTechnologyType: source["Study Assay Technology Type"] || "",
          studyFactorName: source["Study Factor Name"] || "",
          projectType: source["Project Type"] || "",
          managingNASACenter: source["Managing NASA Center"] || "",
        });
      }
    }

    console.log(" NASA API - Parsed studies:", studies.length);

    return {
      hits: data.hits?.total || 0,
      studies,
    };
  } catch (error) {
    console.error(" NASA API error:", error);
    throw new Error(
      `Failed to fetch NASA studies: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Get detailed metadata for a specific study
 */
export async function getStudyMetadata(studyId: string): Promise<any> {
  try {
    const response = await fetch(
      `${NASA_BASE_URL}/osdr/data/osd/meta/${studyId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(" NASA API error:", error);
    throw error;
  }
}

/**
 * Get all experiments from NASA OSDR
 */
export async function getAllExperiments(): Promise<any[]> {
  try {
    const response = await fetch(
      `${NASA_BASE_URL}/geode-py/ws/api/experiments`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(" NASA API error:", error);
    return [];
  }
}

/**
 * Map biological system to NASA organism filter
 */
export function mapBiologicalSystemToOrganism(
  system: string
): string | undefined {
  const mapping: Record<string, string> = {
    human: "Homo sapiens",
    plant: "Arabidopsis thaliana",
    microbial: "Escherichia coli",
    animal: "Mus musculus",
  };

  return mapping[system.toLowerCase()];
}

/**
 * Calculate relevance score for a study based on query
 */
export function calculateStudyRelevance(
  study: NASAStudy,
  query: string
): number {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  let score = 0;

  // Check title match
  const titleLower = study.title.toLowerCase();
  if (titleLower.includes(queryLower)) {
    score += 0.5;
  }

  // Check individual word matches in title
  const titleMatches = queryWords.filter((word) => titleLower.includes(word));
  score += titleMatches.length * 0.1;

  // Check description match
  const descLower = study.description.toLowerCase();
  const descMatches = queryWords.filter((word) => descLower.includes(word));
  score += descMatches.length * 0.05;

  // Bonus for recent studies
  if (study.publicReleaseDate) {
    const year = new Date(study.publicReleaseDate).getFullYear();
    if (year >= 2020) score += 0.1;
    if (year >= 2023) score += 0.1;
  }

  return Math.min(score, 1);
}
