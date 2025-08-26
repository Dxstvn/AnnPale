/**
 * Natural Language Search Processor
 * Handles natural language understanding for search queries
 */

export interface NaturalLanguageResult {
  filters: {
    categories?: string[]
    languages?: string[]
    availability?: string
    rating?: number
    priceRange?: [number, number]
  }
  interpretations: string[]
}

export function processNaturalLanguage(query: string): NaturalLanguageResult {
  const result: NaturalLanguageResult = {
    filters: {},
    interpretations: []
  }

  const lowerQuery = query.toLowerCase()

  // Category detection
  const categories: Record<string, string[]> = {
    'Musicians': ['musician', 'singer', 'artist', 'performer'],
    'Comedians': ['comedian', 'comic', 'funny', 'humor'],
    'Athletes': ['athlete', 'sports', 'player', 'coach'],
    'Actors': ['actor', 'actress', 'film', 'movie'],
    'Influencers': ['influencer', 'creator', 'blogger', 'youtuber']
  }

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      result.filters.categories = result.filters.categories || []
      result.filters.categories.push(category)
    }
  }

  // Language detection
  if (lowerQuery.includes('french') || lowerQuery.includes('français')) {
    result.filters.languages = result.filters.languages || []
    result.filters.languages.push('fr')
  }
  if (lowerQuery.includes('creole') || lowerQuery.includes('kreyòl')) {
    result.filters.languages = result.filters.languages || []
    result.filters.languages.push('ht')
  }
  if (lowerQuery.includes('english')) {
    result.filters.languages = result.filters.languages || []
    result.filters.languages.push('en')
  }

  // Availability detection
  if (lowerQuery.includes('this weekend') || lowerQuery.includes('weekend')) {
    result.filters.availability = 'weekend'
  } else if (lowerQuery.includes('today')) {
    result.filters.availability = 'today'
  } else if (lowerQuery.includes('tomorrow')) {
    result.filters.availability = 'tomorrow'
  } else if (lowerQuery.includes('this week')) {
    result.filters.availability = 'week'
  }

  // Rating detection
  if (lowerQuery.includes('highly rated') || lowerQuery.includes('top rated')) {
    result.filters.rating = 4.5
  } else if (lowerQuery.includes('well rated') || lowerQuery.includes('good rating')) {
    result.filters.rating = 4
  }

  // Price understanding
  const priceMatch = lowerQuery.match(/under\s+\$?(\d+)|below\s+\$?(\d+)|less\s+than\s+\$?(\d+)/)
  if (priceMatch) {
    const price = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3])
    result.filters.priceRange = [0, price]
  }

  // Time-based interpretations
  if (lowerQuery.includes('new') || lowerQuery.includes('recent')) {
    result.interpretations.push('new')
  }
  if (lowerQuery.includes('this month')) {
    result.interpretations.push('current_month')
  }
  if (lowerQuery.includes('trending') || lowerQuery.includes('popular')) {
    result.interpretations.push('trending')
  }

  // Special terms
  if (lowerQuery.includes('verified')) {
    result.interpretations.push('verified')
  }
  if (lowerQuery.includes('available')) {
    result.interpretations.push('available')
  }

  return result
}