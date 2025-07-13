import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      title: "Parser",
      description: "Parse and validate UCUM unit expressions",
      href: "/parser",
      examples: ["mg/dL", "mmol/L", "10*6/uL"]
    },
    {
      title: "Converter",
      description: "Convert between compatible units",
      href: "/converter", 
      examples: ["100 mg/dL → mmol/L", "98.6 °F → °C", "150 lb → kg"]
    },
    {
      title: "FHIR",
      description: "Build FHIR Quantity objects with validation",
      href: "/fhir",
      examples: ["Glucose: 5.5 mmol/L", "Weight: 70 kg", "BP: 120 mm[Hg]"]
    },
    {
      title: "Operations",
      description: "Perform arithmetic operations on quantities",
      href: "/operations",
      examples: ["Addition", "Subtraction", "Comparison"]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          UCUM Playground
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive playground for the Unified Code for Units of Measure (UCUM).
          Parse, convert, and validate units used in healthcare and scientific applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Examples:</p>
                  <ul className="text-sm space-y-1">
                    {feature.examples.map((example, i) => (
                      <li key={i} className="font-mono text-muted-foreground">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">About UCUM</h2>
        <p className="text-muted-foreground">
          The Unified Code for Units of Measure (UCUM) is a code system intended to include all units of measures 
          being contemporarily used in international science, engineering, and business. It is used extensively 
          in healthcare standards like HL7 FHIR for representing quantities with units.
        </p>
        <div className="mt-4">
          <a 
            href="https://ucum.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Learn more at ucum.org →
          </a>
        </div>
      </div>
    </div>
  );
}
