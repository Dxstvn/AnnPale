/**
 * Advanced Search Parser
 * Handles parsing of advanced search queries with operators
 */

export interface SearchResult {
  exactPhrases: string[]
  includeTerms: string[]
  excludeTerms: string[]
  orGroups: string[][]
  wildcards: string[]
  plainText: string[]
  priceFilter?: {
    min?: number
    max?: number
  }
  command?: {
    type: string
    argument?: string
  }
}

export function parseAdvancedSearch(query: string): SearchResult {
  const result: SearchResult = {
    exactPhrases: [],
    includeTerms: [],
    excludeTerms: [],
    orGroups: [],
    wildcards: [],
    plainText: []
  }

  // Parse slash commands first
  const commandRegex = /^\/(\w+)(?:\s+(.+))?$/
  const commandMatch = query.match(commandRegex)
  if (commandMatch) {
    result.command = {
      type: commandMatch[1],
      argument: commandMatch[2]
    }
    return result // Return early for commands
  }

  // Parse exact phrases (quoted strings)
  const phraseRegex = /"([^"]+)"/g
  let match
  while ((match = phraseRegex.exec(query)) !== null) {
    result.exactPhrases.push(match[1])
  }

  // Parse include terms (+term)
  const includeRegex = /\+(\w+)/g
  while ((match = includeRegex.exec(query)) !== null) {
    result.includeTerms.push(match[1])
  }

  // Parse exclude terms (-term)
  const excludeRegex = /-(\w+)/g
  while ((match = excludeRegex.exec(query)) !== null) {
    result.excludeTerms.push(match[1])
  }

  // Parse OR groups
  const orRegex = /(\w+)\s+OR\s+(\w+)/gi
  while ((match = orRegex.exec(query)) !== null) {
    result.orGroups.push([match[1], match[2]])
  }

  // Parse wildcards
  const wildcardRegex = /(\w+)\*/g
  while ((match = wildcardRegex.exec(query)) !== null) {
    result.wildcards.push(match[1])
  }

  // Parse price filters
  const maxPriceRegex = /<\$(\d+)/
  const minPriceRegex = />\$(\d+)/
  
  const maxMatch = query.match(maxPriceRegex)
  const minMatch = query.match(minPriceRegex)
  
  if (maxMatch || minMatch) {
    result.priceFilter = {}
    if (maxMatch) result.priceFilter.max = parseInt(maxMatch[1])
    if (minMatch) result.priceFilter.min = parseInt(minMatch[1])
  }

  // Extract plain text (remaining terms)
  let cleanQuery = query
    .replace(phraseRegex, '')
    .replace(includeRegex, '')
    .replace(excludeRegex, '')
    .replace(orRegex, '')
    .replace(wildcardRegex, '')
    .replace(maxPriceRegex, '')
    .replace(minPriceRegex, '')
    .trim()
  
  if (cleanQuery) {
    result.plainText = cleanQuery.split(/\s+/).filter(Boolean)
  }

  return result
}

export function buildSearchQuery(result: SearchResult): string {
  const parts: string[] = []
  
  // Add exact phrases
  result.exactPhrases.forEach(phrase => {
    parts.push(`"${phrase}"`)
  })
  
  // Add include terms
  result.includeTerms.forEach(term => {
    parts.push(`+${term}`)
  })
  
  // Add exclude terms
  result.excludeTerms.forEach(term => {
    parts.push(`-${term}`)
  })
  
  // Add OR groups
  result.orGroups.forEach(group => {
    parts.push(group.join(' OR '))
  })
  
  // Add wildcards
  result.wildcards.forEach(wildcard => {
    parts.push(`${wildcard}*`)
  })
  
  // Add price filters
  if (result.priceFilter?.max) {
    parts.push(`<$${result.priceFilter.max}`)
  }
  if (result.priceFilter?.min) {
    parts.push(`>$${result.priceFilter.min}`)
  }
  
  // Add plain text
  parts.push(...result.plainText)
  
  return parts.join(' ')
}