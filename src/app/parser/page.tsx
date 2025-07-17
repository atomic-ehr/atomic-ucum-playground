"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Autocomplete } from "@/components/ui/autocomplete"
import ucum from "@atomic-ehr/ucum"
import type { ValidationResult } from "@atomic-ehr/ucum"
import { searchUCUMCodes } from "@/lib/ucum-common"

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
  "g/(8.h)",
  // Broken examples
  "mg//dL",
  "invalid_unit",
  "10^^6",
  "mg..kg",
  "[unknown]",
  "mg/",
  "/mL",
  "10*",
  "kg[",
  "m]]"
]

type ParseResult = {
  expression: string;
  isValid: boolean;
  dimension: string;
  displayName: string;
  type: string;
  canonical?: {
    magnitude: number;
    units: string;
  };
  isMetric?: boolean;
  isSpecial?: boolean;
  isArbitrary?: boolean;
};

export default function ParserPage() {
  const [expression, setExpression] = useState("mg/dL")
  const [result, setResult] = useState<ParseResult | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  
  // Autocomplete options based on current input
  const autocompleteOptions = useMemo(() => {
    const suggestions = searchUCUMCodes(expression, 15)
    return suggestions.map(item => ({
      value: item.code,
      label: item.display
    }))
  }, [expression])

  const parseExpression = async (expr?: string) => {
    const exprToParse = expr || expression
    if (!exprToParse.trim()) return
    
    setLoading(true)
    setError("")
    setValidationResult(null)
    
    try {
      // First validate the unit
      const validation = ucum.validate(exprToParse)
      setValidationResult(validation)
      
      if (validation.valid) {
        // Get detailed unit info
        const unitInfo = ucum.info(exprToParse)
        
        // Format dimension for display
        const dimensionArray = Object.entries(unitInfo.dimension)
          .filter(([, value]) => value !== 0)
          .map(([dim, exp]) => exp === 1 ? dim : `${dim}^${exp}`)
        
        setResult({
          expression: exprToParse,
          isValid: true,
          dimension: dimensionArray.length > 0 ? `[${dimensionArray.join(' ')}]` : "[dimensionless]",
          displayName: ucum.display(exprToParse),
          type: unitInfo.type,
          canonical: unitInfo.canonical ? {
            magnitude: unitInfo.canonical.magnitude,
            units: unitInfo.canonical.units.map(u => `${u.unit}${u.exponent !== 1 ? `^${u.exponent}` : ''}`).join('.')
          } : undefined,
          isMetric: unitInfo.isMetric,
          isSpecial: unitInfo.isSpecial,
          isArbitrary: unitInfo.isArbitrary
        })
      } else {
        setError(validation.errors[0]?.message || "Invalid UCUM expression")
        setResult(null)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Parse error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setExpression(example)
    // Auto-parse immediately
    parseExpression(example)
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
              <Autocomplete
                value={expression}
                onChange={setExpression}
                onSelect={(value) => {
                  setExpression(value)
                  parseExpression(value)
                }}
                options={autocompleteOptions}
                placeholder="Enter UCUM expression (e.g., mg/dL)"
                onKeyDown={(e) => e.key === "Enter" && !e.defaultPrevented && parseExpression()}
                className="flex-1"
              />
              <Button onClick={() => parseExpression()} disabled={loading}>
                {loading ? "Parsing..." : "Parse"}
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Examples:</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Valid expressions:</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.slice(0, 10).map((example) => (
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
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Invalid expressions (for testing):</p>
                  <div className="flex flex-wrap gap-2">
                    {examples.slice(10).map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => handleExampleClick(example)}
                        className="font-mono border-destructive text-destructive hover:bg-destructive/10"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
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
                {validationResult && validationResult.errors[0]?.position !== undefined && (
                  <div className="mt-3">
                    <div className="font-mono text-sm bg-destructive/5 p-2 rounded border border-destructive/10 whitespace-pre">
                      <div>{expression}</div>
                      <div className="text-destructive">{' '.repeat(validationResult.errors[0].position)}^</div>
                    </div>
                    {validationResult.errors[0].context && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Context: {validationResult.errors[0].context}
                      </p>
                    )}
                    {validationResult.errors[0].suggestion && (
                      <p className="text-xs text-primary mt-1">
                        Suggestion: {validationResult.errors[0].suggestion}
                      </p>
                    )}
                  </div>
                )}
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