// components/query/researcher-query.tsx

"use client";

import { useState } from "react";
import { Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface QueryResult {
  title: string;
  experimentId: string;
  year: number;
  system: string;
  summary: string;
  relevance: number;
  projectType: string;
  managingCenter: string;
  reasoning?: string;
  imageUrl?: string;
}

export default function ResearcherQuery() {
  const [query, setQuery] = useState("");
  const [biologicalSystem, setBiologicalSystem] = useState("all");
  const [yearRange, setYearRange] = useState("all");
  const [results, setResults] = useState<QueryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/query/researcher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          biologicalSystem,
          yearRange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch results");
      }

      const data = await response.json();

      // In your handleSearch function, update the image fetching part:

      // Fetch images for each result
      if (data.results && data.results.length > 0) {
        const resultsWithImages = await Promise.all(
          data.results.map(async (result: QueryResult) => {
            try {
              console.log(`🖼️ Fetching image for: ${result.title}`);

              const imageResponse = await fetch("/api/nasa/images", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  query: result.title,
                  keywords: [
                    result.system,
                    result.projectType,
                    "space biology",
                    "NASA",
                  ],
                }),
              });

              if (imageResponse.ok) {
                const imageData = await imageResponse.json();
                console.log(
                  `✅ Image response for ${result.title}:`,
                  imageData.success ? "SUCCESS" : "FAILED"
                );

                return {
                  ...result,
                  imageUrl: imageData.imageUrl || null,
                };
              } else {
                console.log(
                  `❌ Image fetch failed for ${result.title}:`,
                  imageResponse.status
                );
              }
            } catch (imageError) {
              console.error(
                `💥 Image fetch error for ${result.title}:`,
                imageError
              );
            }

            // Return original result if image fetch fails
            return result;
          })
        );

        setResults(resultsWithImages);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Inputs */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Research Query
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Enter your research question..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Biological System
          </label>
          <Select value={biologicalSystem} onValueChange={setBiologicalSystem}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              <SelectItem value="human">Human</SelectItem>
              <SelectItem value="plant">Plant</SelectItem>
              <SelectItem value="microbial">Microbial</SelectItem>
              <SelectItem value="animal">Animal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Year Range
          </label>
          <Select value={yearRange} onValueChange={setYearRange}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2020-2024">2020-2024</SelectItem>
              <SelectItem value="2015-2019">2015-2019</SelectItem>
              <SelectItem value="2010-2014">2010-2014</SelectItem>
              <SelectItem value="2024">2024 Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        disabled={loading || !query.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-blue-500/30"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching NASA Databases...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Research Database
          </>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <Card
            key={index}
            className="bg-white/5 border-white/10 backdrop-blur-sm hover:border-cyan-500/30 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* Image Section */}
                <div className="flex-shrink-0 w-48 h-48">
                  {result.imageUrl ? (
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-full h-full object-cover rounded-lg border border-white/10"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                      <div className="text-center text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-xs">No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 leading-relaxed">
                        {result.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="font-mono bg-white/10 text-gray-300 px-2 py-1 rounded border border-white/5 text-xs">
                          {result.experimentId}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 text-xs">
                          {result.system}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30 text-xs">
                          {result.year || "Unknown Year"}
                        </span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30 text-xs">
                          {result.projectType}
                        </span>
                        {result.relevance && (
                          <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded border border-amber-500/30 text-xs">
                            {Math.round(result.relevance * 100)}% Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {result.summary}
                  </p>

                  {result.reasoning && (
                    <div className="bg-white/5 rounded-lg p-3 mb-3">
                      <p className="text-cyan-400 text-xs font-medium mb-1">
                        AI Analysis:
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {result.reasoning}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Managed by: {result.managingCenter || "NASA"}</span>
                    <div className="flex gap-2">
                      <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        View Study
                      </button>
                      <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        Download Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {results.length === 0 && !loading && query && (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400">
              No results found. Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
