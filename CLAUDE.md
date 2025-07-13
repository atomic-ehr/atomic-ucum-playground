---
description: Interactive UCUM playground development instructions for AI assistants
package: "@atomic-ehr/ucum-playground"
location: "packages/playground/"
type: "nextjs-app"
---

# UCUM Playground Development Guide

This is the interactive Next.js playground application within the atomic-ucum monorepo. It demonstrates real UCUM functionality through a modern web interface, serving as both a demo and testing platform for the core UCUM library.

## 🏗️ Package Structure

```
packages/playground/
├── src/                       # Next.js application source
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx          # Homepage with feature overview
│   │   ├── parser/           # UCUM parsing demo
│   │   │   └── page.tsx
│   │   ├── converter/        # Unit conversion demo
│   │   │   └── page.tsx
│   │   ├── fhir/            # FHIR Quantity builder demo
│   │   │   └── page.tsx
│   │   ├── operations/       # Quantity arithmetic demo
│   │   │   └── page.tsx
│   │   └── globals.css       # Global styles
│   └── components/           # Reusable UI components
│       ├── navigation.tsx    # Main navigation component
│       └── ui/              # Shadcn/ui components
│           ├── button.tsx
│           ├── card.tsx
│           ├── input.tsx
│           └── select.tsx
├── public/                   # Static assets
├── package.json             # Package configuration
├── tsconfig.json           # TypeScript configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
└── CLAUDE.md              # This file
```

## 🚀 Development Commands

### Essential Commands
```bash
# Navigate to playground
cd packages/playground

# Test the playground

bun run build

# Install dependencies (from workspace root)
cd ../../ && bun install

# Development server

# You should run this commands in background and do not wait for them to finish - they start 
# the server and you can continue with the next commands.

bun run dev
bun --bun run dev  # Use Bun runtime for better performance


# Type checking
bun run typecheck

# Linting
bun run lint
bun run lint --fix

# Production build
bun run build

# Start production server
bun run start

# Clean build artifacts
bun run clean
```

### Development Server
- **URL**: http://localhost:3000 (or next available port)
- **Hot reload**: Enabled with Turbopack
- **TypeScript**: Real-time type checking
- **Tailwind**: CSS hot reload

## 🎮 Application Features

### 1. Parser Page (`src/app/parser/page.tsx`)
**Purpose**: Demonstrate UCUM expression parsing and validation

**Features**:
- Real-time UCUM expression parsing using `UCUMParser`
- Dimensional analysis display
- Token breakdown (if available)
- Error handling for invalid expressions
- Quick example buttons for common units

**UCUM Integration**:
```typescript
import { UCUMParser } from "@atomic-ehr/ucum/fhir";

const parser = new UCUMParser();
const parsed = parser.parse(expression);
// Returns UCUMQuantity with full FHIR structure
```

### 2. Converter Page (`src/app/converter/page.tsx`)
**Purpose**: Showcase unit conversion capabilities

**Features**:
- Real-time unit conversion using `UCUMConverter`
- Conversion factor display
- Unit compatibility checking
- Swap units functionality
- Common medical/clinical conversion examples

**UCUM Integration**:
```typescript
import { UCUMConverter } from "@atomic-ehr/ucum/fhir";

const converter = new UCUMConverter();
const result = converter.convert(value, fromUnit, toUnit);
// Returns UCUMQuantity with converted value
```

### 3. FHIR Page (`src/app/fhir/page.tsx`)
**Purpose**: Build and validate FHIR Quantity objects

**Features**:
- Interactive FHIR Quantity builder using `QuantityBuilder`
- Comparator support (<, <=, >=, >, ~)
- Human-readable unit display
- Valid FHIR JSON output
- Example quantities for different use cases

**UCUM Integration**:
```typescript
import { QuantityBuilder } from "@atomic-ehr/ucum/fhir";

const quantity = new QuantityBuilder(value, code)
  .withUnit(displayName)
  .withComparator(comparator)
  .build();
// Returns complete FHIR-compatible UCUMQuantity
```

### 4. Operations Page (`src/app/operations/page.tsx`)
**Purpose**: Demonstrate quantity arithmetic operations

**Features**:
- Addition and subtraction of compatible quantities
- Quantity comparison with dimensional checking
- Unit compatibility validation
- Real-world medical calculation examples

**UCUM Integration**:
```typescript
import { QuantityBuilder, QuantityOperations } from "@atomic-ehr/ucum/fhir";

const ops = new QuantityOperations();
const result = ops.add(quantity1, quantity2);
const comparison = ops.compare(quantity1, quantity2);
// Handles unit conversion automatically
```

## 🎨 UI/UX Design

### Design System
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui component library
- **Icons**: Lucide React icons
- **Typography**: System fonts with good readability

### Component Architecture
```typescript
// Reusable UI components in src/components/ui/
export interface ButtonProps {
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

// Page-specific components inline or in dedicated files
const ConverterPage = () => {
  const [value, setValue] = useState(100);
  const [result, setResult] = useState<number | null>(null);
  // ...
};
```

### Responsive Design
- **Mobile-first**: Designed for mobile devices
- **Breakpoints**: sm, md, lg, xl for different screen sizes
- **Grid layouts**: Responsive card layouts
- **Navigation**: Collapsible mobile menu

## 🧪 Testing & Validation

### Manual Testing Workflow
```bash
# Start development server
bun run dev

# Test each page:
# 1. Parser: Try various UCUM expressions
# 2. Converter: Test unit conversions
# 3. FHIR: Build quantity objects
# 4. Operations: Perform arithmetic

# Check console for errors
# Verify type safety with TypeScript
# Test responsive design on different screen sizes
```

### Common Test Cases
```typescript
// Parser page tests
"mg/dL"          // Simple unit
"10*6/uL"        // Scientific notation
"mm[Hg]"         // Special units
"invalid_unit"   // Error handling

// Converter page tests
100 mg/dL → mmol/L    // Medical conversion
150 [lb_av] → kg      // Weight conversion
98.6 [degF] → Cel     // Temperature conversion

// FHIR page tests
{ value: 5.5, code: "mmol/L", comparator: "<" }  // Lab result
{ value: 70, code: "kg" }                        // Body weight

// Operations page tests
140 mm[Hg] - 120 mm[Hg] = 20 mm[Hg]  // Blood pressure difference
500 mg + 250 mg = 750 mg              // Medication dosing
```

### Error Handling
- **Invalid UCUM expressions**: Clear error messages
- **Incompatible unit conversions**: Explain why conversion failed
- **Network issues**: Graceful degradation
- **Type errors**: Comprehensive TypeScript checking

## 🛠️ Development Best Practices

### State Management
```typescript
// Use React hooks for local state
const [expression, setExpression] = useState("mg/dL");
const [result, setResult] = useState<any>(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

// Clear error state on new inputs
const handleInputChange = (value: string) => {
  setExpression(value);
  setError(""); // Clear previous errors
};
```

### Error Boundaries
```typescript
// Wrap UCUM operations in try-catch
try {
  const parsed = parser.parse(expression);
  setResult(parsed);
  setError("");
} catch (e) {
  setError(e instanceof Error ? e.message : "Parse error");
  setResult(null);
}
```

### Performance Optimization
- **Debounced inputs**: Avoid excessive API calls
- **Memoization**: Cache expensive calculations
- **Code splitting**: Lazy load non-critical components
- **Bundle optimization**: Tree-shake unused code

### Accessibility
- **Semantic HTML**: Proper heading hierarchy
- **ARIA labels**: Screen reader support
- **Keyboard navigation**: Tab order and focus management
- **Color contrast**: WCAG AA compliance

## 🔄 Real UCUM Integration

### Migration from Mock to Real API
The playground was migrated from mock implementations to real UCUM functionality:

**Before (Mock)**:
```typescript
// src/lib/ucum.ts (removed)
export function parse(expression: string) {
  return { 
    expression, 
    dimension: "M·L^-1·T^-2",
    isValid: true 
  };
}
```

**After (Real UCUM)**:
```typescript
import { UCUMParser } from "@atomic-ehr/ucum/fhir";

const parser = new UCUMParser();
const parsed = parser.parse(expression);
// Real parsing with dimensional analysis
```

### API Differences to Handle
1. **Return types**: UCUMQuantity vs mock objects
2. **Error handling**: Real validation vs always-valid mocks
3. **Performance**: Real parsing vs instant mock responses
4. **Data structure**: FHIR-compliant vs simplified mock data

## 📱 Deployment & Production

### Build Process
```bash
# Production build
bun run build

# Analyze bundle (if configured)
bun run analyze

# Start production server
bun run start
```

### Environment Configuration
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    turbopack: true  // Use Turbopack for faster builds
  },
  typescript: {
    ignoreBuildErrors: false  // Strict type checking
  }
};
```

### Static Assets
- **Favicon**: UCUM-themed icon
- **Images**: Optimized with Next.js Image component
- **Fonts**: System fonts for performance
- **Meta tags**: SEO and social sharing

## 🐛 Common Issues & Solutions

### TypeScript Errors
```bash
# Check types
bun run typecheck

# Common issues:
# - Import paths: Use "@atomic-ehr/ucum/fhir" for FHIR API
# - Return types: Handle UCUMQuantity vs number
# - Error handling: Proper try-catch around UCUM operations
```

### Runtime Errors
```bash
# Check browser console for:
# - UCUM parsing errors
# - Unit conversion failures
# - Network connectivity issues
# - React rendering errors
```

### Performance Issues
```bash
# Profiling:
# - Chrome DevTools Performance tab
# - React DevTools Profiler
# - Next.js bundle analyzer
# - Network throttling tests
```

### Styling Issues
```bash
# Tailwind CSS debugging:
# - Check class name typos
# - Verify Tailwind config
# - Test responsive breakpoints
# - Validate PostCSS processing
```

## 🔗 Integration Points

### Core Library Dependency
```json
{
  "dependencies": {
    "@atomic-ehr/ucum": "workspace:*"
  }
}
```

### Import Strategy
```typescript
// Always use FHIR API for new development
import { UCUMParser, UCUMConverter, QuantityBuilder } from "@atomic-ehr/ucum/fhir";

// Avoid legacy API unless specifically needed
// import { UCUMParser } from "@atomic-ehr/ucum"; // ❌
```

### Data Flow
1. **User input** → React state
2. **React state** → UCUM library calls
3. **UCUM results** → UI updates
4. **Error handling** → User feedback

## 📋 Content Guidelines

### Example Data
- **Medical relevance**: Use realistic clinical units
- **Educational value**: Show common healthcare conversions
- **Diversity**: Cover different medical specialties
- **Clarity**: Clear, understandable examples

### User Interface Text
- **Helpful**: Guide users through features
- **Accurate**: Technically correct UCUM terminology
- **Concise**: Don't overwhelm with information
- **Error messages**: Actionable guidance

### Documentation
- **Tooltips**: Explain UCUM concepts inline
- **Help text**: Guide users on input formats
- **Examples**: Show valid UCUM expressions
- **Links**: Reference official UCUM documentation

## ⚠️ Important Notes

### UCUM Compliance
- **Real functionality**: No mock data in production
- **Error handling**: Graceful failure for invalid units
- **User education**: Help users learn UCUM syntax
- **Validation feedback**: Clear success/error states

### Development Workflow
- **Hot reload**: Test changes immediately
- **Type safety**: Fix TypeScript errors before testing
- **Cross-browser**: Test in multiple browsers
- **Mobile testing**: Verify responsive behavior

### Future Enhancements
- **More examples**: Additional clinical scenarios
- **Better UX**: Improved error messages and guidance
- **Advanced features**: Bulk conversions, unit discovery
- **Performance**: Optimize for large-scale usage

---

**Remember**: This playground is the public face of the UCUM library. Ensure it showcases the full capabilities while being user-friendly and educational.