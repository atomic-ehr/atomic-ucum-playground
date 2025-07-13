"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { parse, convert } from "@atomic-ehr/ucum"

const conversionExamples = [
  { name: "Blood Glucose", value: 100, from: "mg/dL", to: "mmol/L" },
  { name: "Body Weight", value: 150, from: "[lb_av]", to: "kg" },
  { name: "Temperature", value: 98.6, from: "[degF]", to: "Cel" },
  { name: "Blood Pressure", value: 120, from: "mm[Hg]", to: "kPa" },
  { name: "Height", value: 6, from: "[ft_i]", to: "cm" },
  { name: "Volume", value: 1, from: "L", to: "mL" },
]

export default function ConverterPage() {
  const [value, setValue] = useState(100)
  const [fromUnit, setFromUnit] = useState("mg/dL")
  const [toUnit, setToUnit] = useState("mmol/L")
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const performConversion = async () => {
    if (!value || !fromUnit.trim() || !toUnit.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      const fromQuantity = parse(`${value} ${fromUnit}`)
      const converted = convert(fromQuantity, toUnit)
      setResult(converted.value)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: typeof conversionExamples[0]) => {
    setValue(example.value)
    setFromUnit(example.from)
    setToUnit(example.to)
    setResult(null)
    setError("")
  }

  const swapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Unit Converter</h1>
        <p className="text-muted-foreground">
          Convert values between compatible UCUM units with precise calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Input</CardTitle>
            <CardDescription>
              Enter a value and units to convert between
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Value</label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter numeric value"
                />
              </div>
              
              <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                <div>
                  <label className="text-sm font-medium">From Unit</label>
                  <Input
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    placeholder="e.g., mg/dL"
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapUnits}
                  className="mb-0"
                  title="Swap units"
                >
                  ⇄
                </Button>
                
                <div>
                  <label className="text-sm font-medium">To Unit</label>
                  <Input
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    placeholder="e.g., mmol/L"
                  />
                </div>
              </div>

              <Button 
                onClick={performConversion} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Converting..." : "Convert"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
            <CardDescription>
              The converted value and calculation details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive font-medium">Conversion Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {result !== null && (
              <div className="space-y-4">
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {result.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {value.toLocaleString()} {fromUnit} = {result.toLocaleString()} {toUnit}
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-md">
                  <p className="font-medium text-sm mb-2">Conversion Details</p>
                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Input:</span> {value} {fromUnit}</p>
                    <p><span className="font-medium">Output:</span> {result} {toUnit}</p>
                    <p><span className="font-medium">Conversion Factor:</span> {(result / value).toExponential(6)}</p>
                  </div>
                </div>
              </div>
            )}

            {result === null && !error && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Enter values and units above to see the conversion result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Conversions</CardTitle>
          <CardDescription>
            Click any example to load it into the converter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversionExamples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => loadExample(example)}
                className="h-auto p-4 justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{example.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {example.value} {example.from} → {example.to}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Unit Conversion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            UCUM unit conversion uses precise mathematical relationships between units. 
            Only dimensionally compatible units can be converted.
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Length units: m, cm, mm, in, ft, etc.</li>
            <li>Mass units: kg, g, mg, lb, oz, etc.</li>
            <li>Temperature units: Cel, degF, K</li>
            <li>Pressure units: Pa, kPa, mm[Hg], atm</li>
            <li>Concentration units: mg/dL, mmol/L, g/L</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}