"use client"

import * as React from "react"
import type { FilterState } from "./filter-sidebar"

/**
 * Enhanced Natural Language Search Processing
 * Converts natural language queries into structured filters
 */

export interface NLSearchResult {
  query: string
  filters: Partial<FilterState>
  confidence: number
  interpretations: string[]
  suggestions?: string[]
}

// Enhanced natural language patterns
const nlPatterns = {
  // Price patterns
  price: {
    under: /(?:under|below|less than|cheaper than|max(?:imum)?)\s*\$?(\d+)/i,
    over: /(?:over|above|more than|at least|min(?:imum)?)\s*\$?(\d+)/i,
    between: /(?:between|from)\s*\$?(\d+)\s*(?:to|and|-)\s*\$?(\d+)/i,
    affordable: /(?:affordable|cheap|budget|economical|inexpensive)/i,
    expensive: /(?:expensive|premium|luxury|high-end)/i,
    free: /(?:free|no cost|complimentary)/i
  },

  // Category patterns
  category: {
    musicians: /(?:music(?:ian)?s?|singer|artist|band|performer|rapper|dj)/i,
    comedians: /(?:comedi(?:an|enne)s?|funny|humor|joke|stand-?up)/i,
    athletes: /(?:athlete|sport|player|fitness|trainer|coach)/i,
    influencers: /(?:influencer|content creator|blogger|youtuber|social media)/i,
    actors: /(?:actor|actress|movie|film|drama|theater)/i,
    chefs: /(?:chef|cook|culinary|food|restaurant|cuisine)/i
  },

  // Language patterns
  language: {
    english: /(?:english|anglais|speaks? english)/i,
    french: /(?:french|français|francais|speaks? french)/i,
    creole: /(?:creole|kreyol|kreyòl|haitian)/i,
    spanish: /(?:spanish|español|espanol|speaks? spanish)/i,
    multilingual: /(?:multilingual|polyglot|multiple languages)/i
  },

  // Availability patterns
  availability: {
    today: /(?:today|now|immediately|right now|asap)/i,
    tomorrow: /(?:tomorrow|next day)/i,
    thisWeek: /(?:this week|within (?:a|1) week|next few days)/i,
    weekend: /(?:weekend|saturday|sunday|week-?end)/i,
    nextMonth: /(?:next month|in (?:a|1) month)/i,
    flexible: /(?:flexible|whenever|any ?time)/i
  },

  // Response time patterns
  responseTime: {
    instant: /(?:instant|immediate|right away|asap)/i,
    fast: /(?:fast|quick|rapid|express|speedy|within (?:an?|1) hour)/i,
    sameDay: /(?:same day|today|within (?:\d+|a few) hours?)/i,
    nextDay: /(?:next day|24 hours?|tomorrow)/i,
    withinDays: /within (\d+) days?/i
  },

  // Quality patterns
  quality: {
    verified: /(?:verified|authentic|official|certified|genuine)/i,
    topRated: /(?:top|best|highest) (?:rated|reviewed|ranked)/i,
    popular: /(?:popular|trending|hot|famous|well-?known)/i,
    new: /(?:new|recent|fresh|latest|just joined)/i,
    experienced: /(?:experienced|veteran|professional|expert|seasoned)/i
  },

  // Occasion patterns
  occasion: {
    birthday: /(?:birthday|birth day|bday|anniversaire)/i,
    wedding: /(?:wedding|marriage|nuptial|mariage)/i,
    anniversary: /(?:anniversary|anni)/i,
    graduation: /(?:graduation|grad|diploma|degree)/i,
    congratulations: /(?:congratulat(?:ion|e)|congrats|felicitation)/i,
    motivation: /(?:motivat(?:ion|e|ional)|inspir(?:e|ation|ing)|encourag)/i,
    getWell: /(?:get well|recovery|feel better|healing|sick)/i,
    holiday: /(?:christmas|new year|thanksgiving|easter|valentine)/i
  },

  // Location patterns
  location: {
    nearMe: /(?:near me|nearby|local|close by|in my area)/i,
    city: /(?:in|from|based in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    country: /(?:haiti|usa|united states|canada|france|dominican)/i
  },

  // Sorting patterns
  sorting: {
    newest: /(?:newest|latest|recent|just joined)/i,
    cheapest: /(?:cheapest|lowest price|most affordable)/i,
    mostExpensive: /(?:most expensive|highest price|premium)/i,
    mostPopular: /(?:most popular|trending|top|best selling)/i,
    bestRated: /(?:best rated|highest rated|top reviewed)/i
  }
}

/**
 * Process natural language search query
 */
export function processNaturalLanguage(query: string): NLSearchResult {
  const result: NLSearchResult = {
    query: query,
    filters: {},
    confidence: 0,
    interpretations: []
  }

  const lowerQuery = query.toLowerCase()
  let matchCount = 0
  let totalPatterns = 0

  // Process price
  if (nlPatterns.price.between.test(lowerQuery)) {
    const match = lowerQuery.match(nlPatterns.price.between)
    if (match) {
      result.filters.priceRange = [parseInt(match[1]), parseInt(match[2])]
      result.interpretations.push(`Price between $${match[1]} and $${match[2]}`)
      matchCount++
    }
  } else if (nlPatterns.price.under.test(lowerQuery)) {
    const match = lowerQuery.match(nlPatterns.price.under)
    if (match) {
      result.filters.priceRange = [0, parseInt(match[1])]
      result.interpretations.push(`Price under $${match[1]}`)
      matchCount++
    }
  } else if (nlPatterns.price.over.test(lowerQuery)) {
    const match = lowerQuery.match(nlPatterns.price.over)
    if (match) {
      result.filters.priceRange = [parseInt(match[1]), 500]
      result.interpretations.push(`Price over $${match[1]}`)
      matchCount++
    }
  } else if (nlPatterns.price.affordable.test(lowerQuery)) {
    result.filters.priceRange = [0, 50]
    result.interpretations.push("Affordable pricing (under $50)")
    matchCount++
  } else if (nlPatterns.price.expensive.test(lowerQuery)) {
    result.filters.priceRange = [200, 500]
    result.interpretations.push("Premium pricing ($200+)")
    matchCount++
  }
  totalPatterns++

  // Process categories
  const categories: string[] = []
  for (const [category, pattern] of Object.entries(nlPatterns.category)) {
    if (pattern.test(lowerQuery)) {
      categories.push(category.charAt(0).toUpperCase() + category.slice(1))
      matchCount++
    }
  }
  if (categories.length > 0) {
    result.filters.categories = categories
    result.interpretations.push(`Categories: ${categories.join(", ")}`)
  }
  totalPatterns++

  // Process languages
  const languages: string[] = []
  for (const [lang, pattern] of Object.entries(nlPatterns.language)) {
    if (pattern.test(lowerQuery)) {
      languages.push(lang === "creole" ? "ht" : lang.substring(0, 2))
      matchCount++
    }
  }
  if (languages.length > 0) {
    result.filters.languages = languages
    result.interpretations.push(`Languages: ${languages.join(", ")}`)
  }
  totalPatterns++

  // Process availability
  for (const [availability, pattern] of Object.entries(nlPatterns.availability)) {
    if (pattern.test(lowerQuery)) {
      result.filters.availability = availability
      result.interpretations.push(`Available: ${availability}`)
      matchCount++
      break
    }
  }
  totalPatterns++

  // Process response time
  const responseTimes: string[] = []
  if (nlPatterns.responseTime.instant.test(lowerQuery)) {
    responseTimes.push("1h")
    result.interpretations.push("Instant response (within 1 hour)")
    matchCount++
  } else if (nlPatterns.responseTime.fast.test(lowerQuery)) {
    responseTimes.push("24h")
    result.interpretations.push("Fast response (within 24 hours)")
    matchCount++
  } else if (nlPatterns.responseTime.withinDays.test(lowerQuery)) {
    const match = lowerQuery.match(nlPatterns.responseTime.withinDays)
    if (match) {
      responseTimes.push(`${match[1]}d`)
      result.interpretations.push(`Response within ${match[1]} days`)
      matchCount++
    }
  }
  if (responseTimes.length > 0) {
    result.filters.responseTime = responseTimes
  }
  totalPatterns++

  // Process quality filters
  if (nlPatterns.quality.verified.test(lowerQuery)) {
    result.filters.verified = true
    result.interpretations.push("Verified creators only")
    matchCount++
  }
  if (nlPatterns.quality.topRated.test(lowerQuery)) {
    result.filters.rating = 4
    result.interpretations.push("Top rated (4+ stars)")
    matchCount++
  }
  totalPatterns++

  // Process location
  if (nlPatterns.location.nearMe.test(lowerQuery)) {
    result.filters.location = "nearby"
    result.interpretations.push("Near your location")
    matchCount++
  } else if (nlPatterns.location.city.test(lowerQuery)) {
    const match = lowerQuery.match(nlPatterns.location.city)
    if (match) {
      result.filters.location = match[1]
      result.interpretations.push(`Located in ${match[1]}`)
      matchCount++
    }
  }
  totalPatterns++

  // Calculate confidence
  result.confidence = totalPatterns > 0 ? (matchCount / totalPatterns) * 100 : 0

  // Generate suggestions if confidence is low
  if (result.confidence < 30) {
    result.suggestions = generateSuggestions(query)
  }

  return result
}

/**
 * Generate query suggestions
 */
function generateSuggestions(query: string): string[] {
  const suggestions: string[] = []

  // Suggest adding price constraint
  if (!/(price|\$|cheap|expensive|affordable)/i.test(query)) {
    suggestions.push(`${query} under $100`)
  }

  // Suggest adding language
  if (!/(english|french|creole|spanish)/i.test(query)) {
    suggestions.push(`${query} french speaking`)
  }

  // Suggest adding availability
  if (!/(available|today|tomorrow|week)/i.test(query)) {
    suggestions.push(`${query} available today`)
  }

  // Suggest category if none detected
  if (!/(music|comedy|athlete|influencer|actor|chef)/i.test(query)) {
    suggestions.push(`musicians ${query}`)
    suggestions.push(`comedians ${query}`)
  }

  return suggestions.slice(0, 3)
}

/**
 * Extract key phrases from natural language
 */
export function extractKeyPhrases(text: string): string[] {
  const phrases: string[] = []
  
  // Common phrases to extract
  const phrasePatterns = [
    /birthday (wish|message|greeting)/gi,
    /wedding (congratulation|message)/gi,
    /get well (soon|message)/gi,
    /thank you (message|video)/gi,
    /motivational (speech|message)/gi,
    /anniversary (wish|greeting)/gi,
    /graduation (message|congratulation)/gi
  ]

  for (const pattern of phrasePatterns) {
    const matches = text.match(pattern)
    if (matches) {
      phrases.push(...matches)
    }
  }

  return phrases
}

/**
 * Simplify complex natural language query
 */
export function simplifyQuery(query: string): string {
  // Remove common filler words
  const fillerWords = [
    "please", "can you", "i want", "i need", "show me",
    "looking for", "find me", "search for", "give me"
  ]

  let simplified = query.toLowerCase()
  for (const filler of fillerWords) {
    simplified = simplified.replace(new RegExp(`\\b${filler}\\b`, "gi"), "")
  }

  // Remove extra spaces
  simplified = simplified.trim().replace(/\s+/g, " ")

  return simplified
}

/**
 * Generate natural language description from filters
 */
export function filtersToNaturalLanguage(filters: Partial<FilterState>): string {
  const parts: string[] = []

  if (filters.categories?.length) {
    parts.push(filters.categories.join(" or "))
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange
    if (min === 0 && max < 500) {
      parts.push(`under $${max}`)
    } else if (min > 0 && max === 500) {
      parts.push(`over $${min}`)
    } else if (min > 0 && max < 500) {
      parts.push(`between $${min} and $${max}`)
    }
  }

  if (filters.languages?.length) {
    const langNames = filters.languages.map(lang => {
      switch(lang) {
        case "en": return "English"
        case "fr": return "French"
        case "ht": return "Creole"
        case "es": return "Spanish"
        default: return lang
      }
    })
    parts.push(`speaking ${langNames.join(" or ")}`)
  }

  if (filters.availability) {
    parts.push(`available ${filters.availability}`)
  }

  if (filters.verified) {
    parts.push("verified")
  }

  if (filters.rating) {
    parts.push(`${filters.rating}+ star rated`)
  }

  return parts.join(", ")
}