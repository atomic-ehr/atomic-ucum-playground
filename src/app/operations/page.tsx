"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Autocomplete } from "@/components/ui/autocomplete"
import ucum from "@atomic-ehr/ucum"
import type { Quantity } from "@atomic-ehr/ucum"
import { searchUCUMCodes } from "@/lib/ucum-common"

type ComparisonResultDisplay = {
  comparison: -1 | 0 | 1;
  description: string;
  a: Quantity;
  b: Quantity;
  equal: boolean;
  convertible: boolean;
};

const operationExamples = [
  {
    name: "Blood Pressure Difference",
    operation: "subtract",
    a: { value: 140, code: "mm[Hg]" },
    b: { value: 120, code: "mm[Hg]" }
  },
  {
    name: "Total Medication Dose",
    operation: "add", 
    a: { value: 500, code: "mg" },
    b: { value: 250, code: "mg" }
  },
  {
    name: "Sodium Level Comparison",
    operation: "compare",
    a: { value: 145, code: "mmol/L" },
    b: { value: 135, code: "mmol/L" }
  },
  {
    name: "Weight Change",
    operation: "subtract",
    a: { value: 75, code: "kg" },
    b: { value: 73, code: "kg" }
  }
]

const operations = [
  { value: "add", label: "Addition (+)" },
  { value: "subtract", label: "Subtraction (-)" },
  { value: "compare", label: "Comparison" },
]

export default function OperationsPage() {
  const [valueA, setValueA] = useState(140)
  const [codeA, setCodeA] = useState("mm[Hg]")
  const [valueB, setValueB] = useState(120)
  const [codeB, setCodeB] = useState("mm[Hg]")
  const [operation, setOperation] = useState("subtract")
  const [result, setResult] = useState<Quantity | ComparisonResultDisplay | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  // Autocomplete options for units
  const codeAOptions = useMemo(() => {
    const suggestions = searchUCUMCodes(codeA, 15)
    return suggestions.map(item => ({
      value: item.code,
      label: item.display
    }))
  }, [codeA])
  
  const codeBOptions = useMemo(() => {
    const suggestions = searchUCUMCodes(codeB, 15)
    return suggestions.map(item => ({
      value: item.code,
      label: item.display
    }))
  }, [codeB])

  const performOperation = async () => {
    if (!valueA || !codeA.trim() || !valueB || !codeB.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      // Validate both units first
      const validationA = ucum.validate(codeA)
      const validationB = ucum.validate(codeB)
      
      if (!validationA.valid) {
        setError(`Invalid unit A: ${validationA.errors[0]?.message || codeA}`)
        setResult(null)
        return
      }
      
      if (!validationB.valid) {
        setError(`Invalid unit B: ${validationB.errors[0]?.message || codeB}`)
        setResult(null)
        return
      }
      
      // Create quantities
      const qtyA = ucum.quantity(valueA, codeA)
      const qtyB = ucum.quantity(valueB, codeB)
      
      let operationResult: Quantity | ComparisonResultDisplay
      
      switch (operation) {
        case "add":
          // Check if units are convertible
          if (!ucum.isConvertible(codeB, codeA)) {
            setError(`Cannot add ${codeA} and ${codeB} - incompatible dimensions`)
            setResult(null)
            return
          }
          operationResult = ucum.add(qtyA, qtyB)
          break
          
        case "subtract":
          // Check if units are convertible
          if (!ucum.isConvertible(codeB, codeA)) {
            setError(`Cannot subtract ${codeB} from ${codeA} - incompatible dimensions`)
            setResult(null)
            return
          }
          operationResult = ucum.subtract(qtyA, qtyB)
          break
          
        case "compare":
          if (ucum.isConvertible(codeB, codeA)) {
            // Convert B to A's unit for comparison
            const convertedValueB = ucum.convert(valueB, codeB, codeA)
            const comparison = valueA === convertedValueB ? 0 : 
                              valueA > convertedValueB ? 1 : -1
            operationResult = {
              comparison,
              description: comparison === 0 ? "Equal" : 
                          comparison === 1 ? "Greater than" : "Less than",
              a: qtyA,
              b: qtyB,
              equal: comparison === 0,
              convertible: true
            }
          } else {
            // Units not convertible
            operationResult = {
              comparison: 0,
              description: "Not comparable (incompatible units)",
              a: qtyA,
              b: qtyB,
              equal: false,
              convertible: false
            }
          }
          break
          
        default:
          throw new Error("Unknown operation")
      }
      
      setResult(operationResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const loadExample = (example: typeof operationExamples[0]) => {
    setValueA(example.a.value)
    setCodeA(example.a.code)
    setValueB(example.b.value)
    setCodeB(example.b.code)
    setOperation(example.operation)
    setResult(null)
    setError("")
    // Auto-perform operation after loading example
    setTimeout(() => {
      performOperationWithParams(
        example.a.value,
        example.a.code,
        example.b.value,
        example.b.code,
        example.operation
      )
    }, 100)
  }
  
  const performOperationWithParams = async (
    valA: number,
    cdA: string,
    valB: number,
    cdB: string,
    op: string
  ) => {
    if (!valA || !cdA.trim() || !valB || !cdB.trim()) return
    
    setLoading(true)
    setError("")
    
    try {
      // Validate both units first
      const validationA = ucum.validate(cdA)
      const validationB = ucum.validate(cdB)
      
      if (!validationA.valid) {
        setError(`Invalid unit A: ${validationA.errors[0]?.message || cdA}`)
        setResult(null)
        return
      }
      
      if (!validationB.valid) {
        setError(`Invalid unit B: ${validationB.errors[0]?.message || cdB}`)
        setResult(null)
        return
      }
      
      // Create quantities
      const qtyA = ucum.quantity(valA, cdA)
      const qtyB = ucum.quantity(valB, cdB)
      
      let operationResult: Quantity | ComparisonResultDisplay
      
      switch (op) {
        case "add":
          // Check if units are convertible
          if (!ucum.isConvertible(cdB, cdA)) {
            setError(`Cannot add ${cdA} and ${cdB} - incompatible dimensions`)
            setResult(null)
            return
          }
          operationResult = ucum.add(qtyA, qtyB)
          break
          
        case "subtract":
          // Check if units are convertible
          if (!ucum.isConvertible(cdB, cdA)) {
            setError(`Cannot subtract ${cdB} from ${cdA} - incompatible dimensions`)
            setResult(null)
            return
          }
          operationResult = ucum.subtract(qtyA, qtyB)
          break
          
        case "compare":
          if (ucum.isConvertible(cdB, cdA)) {
            // Convert B to A's unit for comparison
            const convertedValueB = ucum.convert(valB, cdB, cdA)
            const comparison = valA === convertedValueB ? 0 : 
                              valA > convertedValueB ? 1 : -1
            operationResult = {
              comparison,
              description: comparison === 0 ? "Equal" : 
                          comparison === 1 ? "Greater than" : "Less than",
              a: qtyA,
              b: qtyB,
              equal: comparison === 0,
              convertible: true
            }
          } else {
            // Units not convertible
            operationResult = {
              comparison: 0,
              description: "Not comparable (incompatible units)",
              a: qtyA,
              b: qtyB,
              equal: false,
              convertible: false
            }
          }
          break
          
        default:
          throw new Error("Unknown operation")
      }
      
      setResult(operationResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation error")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null
    
    if (operation === "compare" && 'comparison' in result) {
      return (
        <div className="space-y-4">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-primary mb-2">
              {valueA} {codeA} {result.comparison === 0 ? "=" : result.comparison > 0 ? ">" : "<"} {valueB} {codeB}
            </div>
            <div className="text-sm text-muted-foreground">
              {result.description}
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-md">
            <p className="font-medium text-sm mb-2">Comparison Result</p>
            <div className="text-xs space-y-1">
              <p><span className="font-medium">Comparison Value:</span> {result.comparison}</p>
              <p><span className="font-medium">Result:</span> {result.description}</p>
            </div>
          </div>
        </div>
      )
    }
    
    // Must be a Quantity (add/subtract result)
    if ('value' in result && 'unit' in result) {
      return (
        <div className="space-y-4">
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {result.value} {result.unit}
            </div>
            <div className="text-sm text-muted-foreground">
              {valueA} {codeA} {operation === "add" ? "+" : "-"} {valueB} {codeB}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-md">
            <p className="font-medium text-sm mb-2">Operation Result</p>
            <pre className="text-xs font-mono bg-background p-3 rounded border overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quantity Operations</h1>
        <p className="text-muted-foreground">
          Perform arithmetic operations and comparisons on UCUM quantities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Operation Input</CardTitle>
            <CardDescription>
              Configure two quantities and the operation to perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">First Quantity (A)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Value</label>
                    <Input
                      type="number"
                      step="any"
                      value={valueA}
                      onChange={(e) => setValueA(parseFloat(e.target.value) || 0)}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit</label>
                    <Autocomplete
                      value={codeA}
                      onChange={setCodeA}
                      options={codeAOptions}
                      placeholder="e.g., mm[Hg]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <label className="text-sm font-medium">Operation</label>
                <select 
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background mt-1"
                >
                  {operations.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Second Quantity (B)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Value</label>
                    <Input
                      type="number"
                      step="any"
                      value={valueB}
                      onChange={(e) => setValueB(parseFloat(e.target.value) || 0)}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit</label>
                    <Autocomplete
                      value={codeB}
                      onChange={setCodeB}
                      options={codeBOptions}
                      placeholder="e.g., mm[Hg]"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={performOperation} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Computing..." : "Perform Operation"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operation Result</CardTitle>
            <CardDescription>
              The result of the quantity operation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive font-medium">Operation Error</p>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            )}

            {result && renderResult()}

            {!result && !error && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Configure quantities and operation above to see the result</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Example Operations</CardTitle>
          <CardDescription>
            Click any example to load it into the calculator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {operationExamples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                onClick={() => loadExample(example)}
                className="h-auto p-4 justify-start"
              >
                <div className="text-left">
                  <div className="font-medium">{example.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {example.a.value} {example.a.code} {example.operation === "add" ? "+" : example.operation === "subtract" ? "-" : "vs"} {example.b.value} {example.b.code}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Quantity Operations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            UCUM quantity operations require dimensional compatibility between operands.
            The system automatically handles unit conversions when possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">Arithmetic Operations</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Addition:</strong> Both quantities must have same dimensions</li>
                <li><strong>Subtraction:</strong> Both quantities must have same dimensions</li>
                <li>Result uses the unit of the first operand</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Comparison</h4>
              <ul className="space-y-1 list-disc list-inside">
                <li>Returns -1 (less), 0 (equal), or 1 (greater)</li>
                <li>Automatically converts units for comparison</li>
                <li>Requires dimensional compatibility</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}