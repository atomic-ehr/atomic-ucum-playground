import commonCodesData from './common-codes.json'

export interface UCUMCommonCode {
  code: string
  display: string
}

export interface FHIRValueSet {
  resourceType: string
  id: string
  compose: {
    include: Array<{
      system: string
      concept: Array<{
        code: string
        display: string
        extension?: Array<{
          url: string
          valueString?: string
        }>
      }>
    }>
  }
}

// Extract common codes from the FHIR ValueSet
const valueSet = commonCodesData as FHIRValueSet

export const commonUCUMCodes: UCUMCommonCode[] = valueSet.compose.include
  .flatMap(include => include.concept)
  .map(concept => ({
    code: concept.code,
    display: concept.display
  }))
  .sort((a, b) => a.code.localeCompare(b.code))

// Search function for autocomplete
export function searchUCUMCodes(query: string, limit: number = 10): UCUMCommonCode[] {
  if (!query) return commonUCUMCodes.slice(0, limit)
  
  const lowerQuery = query.toLowerCase()
  
  // First, find exact prefix matches
  const prefixMatches = commonUCUMCodes.filter(item => 
    item.code.toLowerCase().startsWith(lowerQuery)
  )
  
  // Then, find matches anywhere in the code or display
  const otherMatches = commonUCUMCodes.filter(item => 
    !item.code.toLowerCase().startsWith(lowerQuery) &&
    (item.code.toLowerCase().includes(lowerQuery) || 
     item.display.toLowerCase().includes(lowerQuery))
  )
  
  // Combine and limit results
  return [...prefixMatches, ...otherMatches].slice(0, limit)
}