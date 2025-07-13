# @atomic-ehr/ucum-playground

Interactive Next.js playground demonstrating real UCUM (Unified Code for Units of Measure) functionality. 
This application showcases the capabilities of the [@atomic-ehr/ucum](https://github.com/atomic-ehr/ucum) library through an intuitive web interface.

Demo: [https://atomic-ehr-ucum.vercel.app/](https://atomic-ehr-ucum.vercel.app/)

## Features

- 🎮 **Live UCUM Parsing** - Real-time expression parsing with dimensional analysis
- 🔄 **Unit Conversion** - Interactive conversion between compatible UCUM units  
- 📋 **FHIR Quantity Builder** - Create and validate FHIR-compliant quantity objects
- ➕ **Quantity Operations** - Visual arithmetic operations (add, subtract, compare)
- 📱 **Responsive Design** - Mobile-first interface with Tailwind CSS
- ⚡ **Real UCUM Integration** - Uses actual core library, no mock implementations

## Quick Start

### Development Setup

```bash
# From monorepo root
bun install

# Start the playground
bun run dev
# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

## Application Pages

### 1. Parser Page (`/parser`)
Demonstrate UCUM expression parsing with real-time validation and dimensional analysis.

### 2. Converter Page (`/converter`)
Interactive unit conversion between compatible UCUM units with real-world examples.

### 3. FHIR Page (`/fhir`)
Build and validate FHIR Quantity objects with comparator support.

### 4. Operations Page (`/operations`)
Perform arithmetic operations on quantities with automatic unit compatibility checking.

### Commands

```bash
# Development server
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint

# Production build
bun run build
```
