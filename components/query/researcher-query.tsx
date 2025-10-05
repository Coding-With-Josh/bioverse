"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, FileText, Download, ExternalLink, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QueryResult {
  title: string
  experimentId: string
  year: number
  system: string
  summary: string
  relevance: number
  reasoning?: string
  projectType?: string
  managingCenter?: string
}

export default function ResearcherQuery() {
  const [biologicalSystem, setBiologicalSystem] = useState<string>("all")
  const [yearRange, setYearRange] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<QueryResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResults([])

    console.log(" Submitting researcher query:", { biologicalSystem, yearRange, query })

    try {
      const response = await fetch("/api/query/researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biologicalSystem,
          yearRange,
          query,
        }),
      })

      console.log(" API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error(" API error:", errorData)
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      console.log(" API response data:", data)

      if (data.results && Array.isArray(data.results)) {
        setResults(data.results)
        console.log(" Set", data.results.length, "results")
      } else {
        console.warn(" No results array in response")
        setResults([])
      }
    } catch (error) {
      console.error(" Query error:", error)
      setError(error instanceof Error ? error.message : "Failed to process query. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Query Builder */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="biological-system">Biological System</Label>
            <Select value={biologicalSystem} onValueChange={setBiologicalSystem}>
              <SelectTrigger id="biological-system">
                <SelectValue placeholder="Select system..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                <SelectItem value="human">Human</SelectItem>
                <SelectItem value="plant">Plant</SelectItem>
                <SelectItem value="microbial">Microbial</SelectItem>
                <SelectItem value="animal">Animal Model</SelectItem>
                <SelectItem value="cell">Cell Culture</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-range">Year Range</Label>
            <Select value={yearRange} onValueChange={setYearRange}>
              <SelectTrigger id="year-range">
                <SelectValue placeholder="Select range..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2020-2024">2020-2024</SelectItem>
                <SelectItem value="2015-2024">2015-2024</SelectItem>
                <SelectItem value="2010-2024">2010-2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="query">Research Query</Label>
          <Textarea
            id="query"
            placeholder="Enter your research question or keywords (e.g., 'bone density loss mitigation strategies', 'plant growth under microgravity', 'radiation effects on DNA repair')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <Button type="submit" disabled={isLoading || !query.trim()} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Query...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Execute Query
            </>
          )}
        </Button>
      </form>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Query Results ({results.length})</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>

          <div className="space-y-3">
            {results.map((result, i) => (
              <Card
                key={i}
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold leading-tight">{result.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <span className="font-mono">{result.experimentId}</span>
                          {result.year > 0 && (
                            <>
                              <span>•</span>
                              <span>{result.year}</span>
                            </>
                          )}
                          <span>•</span>
                          <Badge variant="secondary" className="text-xs">
                            {result.system}
                          </Badge>
                          {result.projectType && (
                            <>
                              <span>•</span>
                              <span className="text-xs">{result.projectType}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {Math.round(result.relevance * 100)}% match
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>

                    {result.reasoning && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
                        <span className="font-semibold">AI Analysis: </span>
                        {result.reasoning}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://osdr.nasa.gov/bio/repo/data/studies/${result.experimentId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="mr-2 h-3 w-3" />
                          View on NASA OSDR
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="mr-2 h-3 w-3" />
                        Related Studies
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Build Your Query</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Use the filters above to narrow your search, then enter your research question to find relevant
              publications and experimental data from NASA's Open Science Data Repository.
            </p>
          </div>
        </div>
      )}

      {/* No Results State */}
      {results.length === 0 && !isLoading && !error && query && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No studies found matching your query. Try adjusting your filters or using different keywords.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
