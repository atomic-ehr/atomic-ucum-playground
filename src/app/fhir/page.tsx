"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parse, type UCUMQuantity } from "@atomic-ehr/ucum"

type Comparator = '<' | '<=' | '>=' | '>'

const fhirExamples = [
  { name: "Blood Glucose", value: 5.5, code: "mmol/L", unit: "millimole per liter", comparator: undefined },
  { name: "Body Weight", value: 70, code: "kg", unit: "kilogram", comparator: undefined },
  { name: "Blood Pressure", value: 120, code: "mm[Hg]", unit: "millimeter of mercury", comparator: undefined },
  { name: "High Glucose", value: 11.1, code: "mmol/L", unit: "millimole per liter", comparator: ">" },
  { name: "Low Weight", value: 50, code: "kg", unit: "kilogram", comparator: "<" },
  { name: "Tall Height", value: 175, code: "cm", unit: "centimeter", comparator: ">" },
]

const comparators = [
  { value: "", label: "None" },
  { value: "<", label: "< Less than" },
  { value: "<=", label: "≤ Less than or equal" },
  { value: ">=", label: "≥ Greater than or equal" },
  { value: ">", label: "> Greater than" },
]

export default function FHIRPage() {
  const [value, setValue] = useState(5.5)
  const [code, setCode] = useState("mmol/L")
  const [unit, setUnit] = useState("millimole per liter")
  const [comparator, setComparator] = useState("")
  const [result, setResult] = useState<UCUMQuantity | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const buildQuantity = async () => {
    if (!value || !code.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      const parsed = parse(`${value} ${code}`)
      
      const quantity: UCUMQuantity = {
        value: parsed.value,
        code: parsed.code,
        unit: unit.trim() || parsed.unit,
        system: "http://unitsofmeasure.org",
        ...(comparator && { comparator: comparator as Comparator })
      }
      setResult(quantity)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Build error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: typeof fhirExamples[0]) => {
    setValue(example.value)
    setCode(example.code)
    setUnit(example.unit)
    setComparator(example.comparator || "")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">FHIR Quantity Builder</h1>
        <p className="text-muted-foreground">
          Build valid FHIR Quantity objects with UCUM units for healthcare interoperability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quantity Configuration</CardTitle>
            <CardDescription>
              Configure the properties of your FHIR Quantity object
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Value *</label>
                <Input
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter numeric value"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">UCUM Code *</label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g., mg/dL, mmol/L, kg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The UCUM code for the unit
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Human-readable Unit</label>
                <Input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g., milligram per deciliter"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional human-readable unit description
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Comparator</label>
                <select 
                  value={comparator}
                  onChange={(e) => setComparator(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  {comparators.map((comp) => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional comparator for the value
                </p>
              </div>

              <Button 
                onClick={buildQuantity} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Building..." : "Build FHIR Quantity"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>FHIR Quantity JSON</CardTitle>
            <CardDescription>
              The generated FHIR Quantity resource
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive font-medium">Build Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="font-medium text-sm mb-2">FHIR Quantity ✓</p>
                  <pre className="text-xs font-mono bg-background p-3 rounded border overflow-auto max-h-64">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 border rounded">
                    <p className="font-medium">Value</p>
                    <p className="font-mono">{result.value}</p>
                  </div>
                  
                  {result.comparator && (
                    <div className="p-3 border rounded">
                      <p className="font-medium">Comparator</p>
                      <p className="font-mono">{result.comparator}</p>
                    </div>
                  )}
                  
                  <div className="p-3 border rounded">
                    <p className="font-medium">UCUM Code</p>
                    <p className="font-mono">{result.code}</p>
                  </div>
                  
                  {result.unit && (
                    <div className="p-3 border rounded">
                      <p className="font-medium">Unit</p>
                      <p>{result.unit}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Configure the quantity above to see the FHIR JSON</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Example Quantities</CardTitle>
          <CardDescription>
            Click any example to load it into the builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fhirExamples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => loadExample(example)}
                className="h-auto p-4 justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{example.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {example.comparator || ""}{example.value} {example.code}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {example.unit}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About FHIR Quantity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            FHIR Quantity is a data type used to represent measured amounts in healthcare. 
            It includes a numerical value, unit of measure, and optional comparator.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Required Properties</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><code>value</code> - The numerical value</li>
                <li><code>code</code> - UCUM unit code</li>
                <li><code>system</code> - Always &quot;http://unitsofmeasure.org&quot;</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Optional Properties</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><code>comparator</code> - &lt;, &lt;=, &gt;=, &gt;, ~</li>
                <li><code>unit</code> - Human-readable unit</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}