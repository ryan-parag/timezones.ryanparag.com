import { format, formatInTimeZone } from 'date-fns-tz'
import { TimezoneData } from '@/types'
import { cities } from './citiesWrapper'

export function formatTime(date: Date, timezone: string, is24Hour: boolean): string {
  const pattern = is24Hour ? 'HH:mm' : 'h:mm aa'
  return formatInTimeZone(date, timezone, pattern)
}

export function formatDate(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, 'MM-dd-yyyy')
}

export function getTimezoneName(timezone: string): string {
  const parts = timezone.split('/')
  if (parts.length > 1) {
    return parts[1].replace(/_/g, ' ') + ' Time'
  }
  return timezone
}

export function getGMTOffset(date: Date, timezone: string): string {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
  
  const sign = offset >= 0 ? '+' : '-'
  const hours = Math.floor(Math.abs(offset))
  const minutes = Math.floor((Math.abs(offset) - hours) * 60)
  
  return `(GMT${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')})`
}

export function getTimezoneAbbreviation(timezone: string): string {
  // Common timezone abbreviations
  const abbreviations: Record<string, string> = {
    'America/New_York': 'Eastern Time',
    'America/Chicago': 'Central Time',
    'America/Denver': 'Mountain Time',
    'America/Los_Angeles': 'Pacific Time',
    'Europe/London': 'London',
    'Europe/Paris': 'Central European Time',
    'Asia/Tokyo': 'Japan Standard Time',
    'Asia/Shanghai': 'China Standard Time',
    'Australia/Sydney': 'Australian Eastern Time',
  }
  
  return abbreviations[timezone] || getTimezoneName(timezone)
}

// Country code to country name mapping (common ones)
const countryCodeMap: Record<string, string> = {
  'US': 'USA',
  'GB': 'UK',
  'CN': 'China',
  'JP': 'Japan',
  'KR': 'South Korea',
  'IN': 'India',
  'AU': 'Australia',
  'CA': 'Canada',
  'MX': 'Mexico',
  'BR': 'Brazil',
  'AR': 'Argentina',
  'FR': 'France',
  'DE': 'Germany',
  'IT': 'Italy',
  'ES': 'Spain',
  'NL': 'Netherlands',
  'IE': 'Ireland',
  'RU': 'Russia',
  'AE': 'UAE',
  'SG': 'Singapore',
  'HK': 'Hong Kong',
  'ZA': 'South Africa',
  'BD': 'Bangladesh',
  'PL': 'Poland',
}

function getCountryName(code: string): string {
  return countryCodeMap[code] || code
}

export async function searchCity(query: string): Promise<TimezoneData[]> {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []

  // Check if cities data is loaded
  if (!cities || Object.keys(cities).length === 0) {
    console.warn('Cities data not loaded. Cities object:', cities)
    return []
  }

  const matches: Array<{ data: TimezoneData; population: number; score: number }> = []

  // Search through all cities
  for (const [cityName, cityEntries] of Object.entries(cities)) {
    if (!Array.isArray(cityEntries)) continue

    const lowerCityName = cityName.toLowerCase()
    
    // Check if query matches city name
    if (lowerCityName.includes(lowerQuery) || lowerQuery.includes(lowerCityName)) {
      for (const entry of cityEntries) {
        if (!entry.tz || !entry.name) continue

        // Calculate a relevance score
        let score = 0
        const exactMatch = lowerCityName === lowerQuery
        const startsWith = lowerCityName.startsWith(lowerQuery)
        const contains = lowerCityName.includes(lowerQuery)

        if (exactMatch) score = 1000
        else if (startsWith) score = 500
        else if (contains) score = 100

        // Boost score by population (larger cities are more relevant)
        score += Math.log10((entry.population || 0) + 1) * 10

        matches.push({
          data: {
            id: `${entry.tz}-${entry.id}-${Date.now()}-${Math.random()}`,
            city: entry.name,
            timezone: entry.tz,
            country: getCountryName(entry.country || ''),
          },
          population: entry.population || 0,
          score,
        })
      }
    }
  }

  // Sort by score (relevance) and population, then limit results
  matches.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return b.population - a.population
  })

  // Return top 30 matches
  const results = matches.slice(0, 30).map(m => m.data)

  // If no matches, try to construct a timezone from the query
  if (results.length === 0) {
    const timezonePatterns = [
      { pattern: /america\/(.+)/i, prefix: 'America/' },
      { pattern: /europe\/(.+)/i, prefix: 'Europe/' },
      { pattern: /asia\/(.+)/i, prefix: 'Asia/' },
      { pattern: /australia\/(.+)/i, prefix: 'Australia/' },
      { pattern: /africa\/(.+)/i, prefix: 'Africa/' },
    ]

    for (const { pattern, prefix } of timezonePatterns) {
      const match = query.match(pattern)
      if (match) {
        const tzName = match[1].replace(/\s+/g, '_')
        results.push({
          id: `${prefix}${tzName}-${Date.now()}`,
          city: query,
          timezone: `${prefix}${tzName}`,
        })
        break
      }
    }
  }

  return results
}

