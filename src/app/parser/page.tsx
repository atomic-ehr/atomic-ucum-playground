"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parse } from "@atomic-ehr/ucum"

const examples = [
  "mg/dL",
  "mmol/L", 
  "10*6/uL",
  "4.[pi].10*-7.N/A2",
  "kg.m/s2",
  "mm[Hg]",
  "[degF]",
  "Cel",
  "m2.s-1",
  "g/(8.h)"
]

type ParseResult = {
  expression: string;
  isValid: boolean;
  tokens: never[];
  dimension: string;
  displayName: string;
  baseUnit: string;
  canonical?: {
    value: number;
    units: Record<string, number>;
  };
  system?: string;
};

export default function ParserPage() {
  const [expression, setExpression] = useState("mg/dL")
  const [result, setResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const parseExpression = async () => {
    if (!expression.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      const parsed = parse(expression)
      setResult({
        expression,
        isValid: true,
        tokens: [], // Not available in real API
        dimension: parsed.ucum?.dimension ? 
          `[${parsed.ucum.dimension.join(', ')}]` : "Unknown",
        displayName: parsed.unit || expression,
        baseUnit: parsed.code,
        canonical: parsed.ucum?.canonical,
        system: parsed.system || "http://unitsofmeasure.org"
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setExpression(example)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">UCUM Parser</h1>
        <p className="text-muted-foreground">
          Parse and validate UCUM unit expressions to understand their structure and meaning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expression Input</CardTitle>
            <CardDescription>
              Enter a UCUM expression to parse and analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Enter UCUM expression (e.g., mg/dL)"
                onKeyDown={(e) => e.key === "Enter" && parseExpression()}
              />
              <Button onClick={parseExpression} disabled={loading}>
                {loading ? "Parsing..." : "Parse"}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Examples:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <Button
                    key={example}
                    variant="outline"
                    size="sm"
                    onClick={() => handleExampleClick(example)}
                    className="font-mono"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parse Result</CardTitle>
            <CardDescription>
              Detailed breakdown of the parsed expression
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive font-medium">Parse Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <p className="font-medium text-sm mb-2">Parsed Successfully ✓</p>
                  <pre className="text-xs font-mono bg-background p-3 rounded border overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>

                {result.dimension && (
                  <div className="p-4 border rounded-md">
                    <p className="font-medium text-sm mb-2">Dimensional Analysis</p>
                    <p className="text-sm font-mono">{result.dimension}</p>
                  </div>
                )}

                {result.displayName && (
                  <div className="p-4 border rounded-md">
                    <p className="font-medium text-sm mb-2">Display Name</p>
                    <p className="text-sm">{result.displayName}</p>
                  </div>
                )}
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter an expression above to see the parse result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Understanding UCUM Syntax</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Basic Operations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="font-mono">.</code> - Multiplication</li>
                <li><code className="font-mono">/</code> - Division</li>
                <li><code className="font-mono">^</code> - Exponentiation</li>
                <li><code className="font-mono">( )</code> - Grouping</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Special Notation</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="font-mono">10*n</code> - Scientific notation</li>
                <li><code className="font-mono">[unit]</code> - Special units</li>
                <li><code className="font-mono">unit2</code> - Square</li>
                <li><code className="font-mono">unit-1</code> - Inverse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}