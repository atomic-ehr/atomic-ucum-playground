"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Parser", href: "/parser" },
  { name: "Converter", href: "/converter" },
  { name: "FHIR", href: "/fhir" },
  { name: "Operations", href: "/operations" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:text-foreground/80"
            >
              UCUM Playground
            </Link>
            <div className="flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Interactive UCUM unit parsing and conversion
          </div>
        </div>
      </div>
    </nav>
  )
}