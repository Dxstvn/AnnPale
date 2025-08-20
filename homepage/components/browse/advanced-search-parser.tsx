"use client"

import * as React from "react"
import type { FilterState } from "./filter-sidebar"

/**
 * Advanced Search Parser
 * Implements search operators and commands for power users
 */

// Search operator types
export type SearchOperator = 
  | "exact"      // "phrase"
  | "include"    // +word
  | "exclude"    // -word
  | "or"         // word OR word
  | "wildcard"   // word*
  | "price"      // <$100 or >$50
  | "command"    // /command

// Parsed search token
export interface SearchToken {
  type: SearchOperator | "text"
  value: string
  original: string
}

// Parsed search query
export interface ParsedSearch {
  tokens: SearchToken[]
  exactPhrases: string[]
  includeTerms: string[]
  excludeTerms: string[]
  orGroups: string[][]
  wildcards: string[]
  priceFilter?: { min?: number; max?: number }
  command?: SearchCommand
  plainText: string
  filters?: Partial<FilterState>
}

// Search command structure
export interface SearchCommand {
  type: "category" | "creator" | "recent" | "trending" | "help" | "saved" | "clear"
  argument?: string
}

/**
 * Parse advanced search query with operators
 */
export function parseAdvancedSearch(query: string): ParsedSearch {
  const result: ParsedSearch = {
    tokens: [],
    exactPhrases: [],
    includeTerms: [],
    excludeTerms: [],
    orGroups: [],
    wildcards: [],
    plainText: "",
    filters: {}
  }

  // Check for commands first (/ prefix)
  if (query.startsWith("/")) {
    const commandMatch = query.match(/^\/(\w+)(?:\s+(.*))?/)
    if (commandMatch) {
      const [, cmd, args] = commandMatch
      result.command = parseCommand(cmd, args)
      return result
    }
  }

  // Tokenize the query
  const tokens = tokenizeQuery(query)
  result.tokens = tokens

  // Process each token
  let plainTextParts: string[] = []
  let currentOrGroup: string[] = []
  let inOrGroup = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const nextToken = tokens[i + 1]

    switch (token.type) {
      case "exact":
        result.exactPhrases.push(token.value)
        break

      case "include":
        result.includeTerms.push(token.value)
        break

      case "exclude":
        result.excludeTerms.push(token.value)
        break

      case "wildcard":
        result.wildcards.push(token.value)
        break

      case "price":
        const priceFilter = parsePriceOperator(token.value)
        if (priceFilter) {
          result.priceFilter = priceFilter
          // Convert to filter
          result.filters!.priceRange = [
            priceFilter.min || 0,
            priceFilter.max || 500
          ]
        }
        break

      case "text":
        // Check for OR operator
        if (nextToken?.type === "or") {
          if (!inOrGroup) {
            currentOrGroup = [token.value]
            inOrGroup = true
          } else {
            currentOrGroup.push(token.value)
          }
        } else if (inOrGroup) {
          currentOrGroup.push(token.value)
          result.orGroups.push(currentOrGroup)
          currentOrGroup = []
          inOrGroup = false
        } else {
          plainTextParts.push(token.value)
        }
        break

      case "or":
        // OR operator handled in text case
        break
    }
  }

  // Close any open OR group
  if (inOrGroup && currentOrGroup.length > 0) {
    result.orGroups.push(currentOrGroup)
  }

  result.plainText = plainTextParts.join(" ")

  return result
}

/**
 * Tokenize search query into operators and text
 */
function tokenizeQuery(query: string): SearchToken[] {
  const tokens: SearchToken[] = []
  const regex = /("([^"]+)")|(\+\w+)|(-\w+)|(\w+\*)|(<\$?\d+)|(>\$?\d+)|(\w+\s+OR\s+\w+)|(\w+)/g
  
  let match
  while ((match = regex.exec(query)) !== null) {
    const [original] = match

    if (match[1]) {
      // Exact phrase "..."
      tokens.push({
        type: "exact",
        value: match[2],
        original
      })
    } else if (match[3]) {
      // Include +word
      tokens.push({
        type: "include",
        value: match[3].substring(1),
        original
      })
    } else if (match[4]) {
      // Exclude -word
      tokens.push({
        type: "exclude",
        value: match[4].substring(1),
        original
      })
    } else if (match[5]) {
      // Wildcard word*
      tokens.push({
        type: "wildcard",
        value: match[5].slice(0, -1),
        original
      })
    } else if (match[6] || match[7]) {
      // Price <$100 or >$50
      tokens.push({
        type: "price",
        value: original,
        original
      })
    } else if (match[8]) {
      // OR operator
      const parts = match[8].split(/\s+OR\s+/i)
      tokens.push({
        type: "text",
        value: parts[0],
        original: parts[0]
      })
      tokens.push({
        type: "or",
        value: "OR",
        original: "OR"
      })
      tokens.push({
        type: "text",
        value: parts[1],
        original: parts[1]
      })
    } else if (match[9]) {
      // Regular word
      tokens.push({
        type: "text",
        value: match[9],
        original
      })
    }
  }

  return tokens
}

/**
 * Parse command from /command syntax
 */
function parseCommand(cmd: string, args?: string): SearchCommand {
  const command = cmd.toLowerCase()
  
  switch (command) {
    case "category":
    case "cat":
      return { type: "category", argument: args }
    
    case "creator":
    case "user":
      return { type: "creator", argument: args }
    
    case "recent":
    case "history":
      return { type: "recent" }
    
    case "trending":
    case "popular":
      return { type: "trending" }
    
    case "saved":
    case "bookmarks":
      return { type: "saved" }
    
    case "clear":
    case "reset":
      return { type: "clear" }
    
    case "help":
    case "?":
    default:
      return { type: "help" }
  }
}

/**
 * Parse price operator <$100 or >$50
 */
function parsePriceOperator(value: string): { min?: number; max?: number } | null {
  const lessThanMatch = value.match(/<\$?(\d+)/)
  const greaterThanMatch = value.match(/>\$?(\d+)/)

  if (lessThanMatch) {
    return { max: parseInt(lessThanMatch[1]) }
  }
  
  if (greaterThanMatch) {
    return { min: parseInt(greaterThanMatch[1]) }
  }

  return null
}

/**
 * Build search query from parsed tokens
 */
export function buildSearchQuery(parsed: ParsedSearch): string {
  const parts: string[] = []

  // Add exact phrases
  parsed.exactPhrases.forEach(phrase => {
    parts.push(`"${phrase}"`)
  })

  // Add include terms
  parsed.includeTerms.forEach(term => {
    parts.push(`+${term}`)
  })

  // Add exclude terms
  parsed.excludeTerms.forEach(term => {
    parts.push(`-${term}`)
  })

  // Add OR groups
  parsed.orGroups.forEach(group => {
    parts.push(group.join(" OR "))
  })

  // Add wildcards
  parsed.wildcards.forEach(wildcard => {
    parts.push(`${wildcard}*`)
  })

  // Add price filter
  if (parsed.priceFilter) {
    if (parsed.priceFilter.max) {
      parts.push(`<$${parsed.priceFilter.max}`)
    }
    if (parsed.priceFilter.min) {
      parts.push(`>$${parsed.priceFilter.min}`)
    }
  }

  // Add plain text
  if (parsed.plainText) {
    parts.push(parsed.plainText)
  }

  return parts.join(" ")
}

/**
 * Apply parsed search to filter state
 */
export function applyParsedFilters(
  parsed: ParsedSearch,
  currentFilters: FilterState
): FilterState {
  const newFilters = { ...currentFilters }

  // Apply price filter
  if (parsed.priceFilter) {
    newFilters.priceRange = [
      parsed.priceFilter.min || currentFilters.priceRange[0],
      parsed.priceFilter.max || currentFilters.priceRange[1]
    ]
  }

  // Apply other filters from parsed.filters
  if (parsed.filters) {
    Object.assign(newFilters, parsed.filters)
  }

  return newFilters
}

/**
 * Check if query uses advanced operators
 */
export function hasAdvancedOperators(query: string): boolean {
  return /["+-]|\bOR\b|\*|[<>]\$?\d+|^\//.test(query)
}

/**
 * Get operator help text
 */
export function getOperatorHelp(): Array<{
  operator: string
  description: string
  example: string
}> {
  return [
    {
      operator: '" "',
      description: "Exact phrase match",
      example: '"birthday message"'
    },
    {
      operator: "+",
      description: "Must include term",
      example: "+musician +french"
    },
    {
      operator: "-",
      description: "Exclude term",
      example: "comedy -adult"
    },
    {
      operator: "OR",
      description: "Either/or search",
      example: "musician OR singer"
    },
    {
      operator: "*",
      description: "Wildcard search",
      example: "dan*"
    },
    {
      operator: "<$",
      description: "Price less than",
      example: "<$100"
    },
    {
      operator: ">$",
      description: "Price greater than",
      example: ">$50"
    },
    {
      operator: "/",
      description: "Quick commands",
      example: "/category music"
    }
  ]
}