import { format, formatInTimeZone } from 'date-fns-tz'
import { TimezoneData } from '@/types'

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

export async function searchCity(query: string): Promise<TimezoneData[]> {
  // Use a timezone database or API
  // For now, we'll use a simple mapping of common cities
  const cityMap: Record<string, { timezone: string; city: string; country?: string; state?: string }> = {
    // US Cities
    'new york': { timezone: 'America/New_York', city: 'New York', state: 'NY', country: 'USA' },
    'los angeles': { timezone: 'America/Los_Angeles', city: 'Los Angeles', state: 'CA', country: 'USA' },
    'chicago': { timezone: 'America/Chicago', city: 'Chicago', state: 'IL', country: 'USA' },
    'denver': { timezone: 'America/Denver', city: 'Denver', state: 'CO', country: 'USA' },
    'tampa': { timezone: 'America/New_York', city: 'Tampa', state: 'FL', country: 'USA' },
    'detroit': { timezone: 'America/New_York', city: 'Detroit', state: 'MI', country: 'USA' },
    'miami': { timezone: 'America/New_York', city: 'Miami', state: 'FL', country: 'USA' },
    'boston': { timezone: 'America/New_York', city: 'Boston', state: 'MA', country: 'USA' },
    'philadelphia': { timezone: 'America/New_York', city: 'Philadelphia', state: 'PA', country: 'USA' },
    'washington': { timezone: 'America/New_York', city: 'Washington', state: 'DC', country: 'USA' },
    'atlanta': { timezone: 'America/New_York', city: 'Atlanta', state: 'GA', country: 'USA' },
    'houston': { timezone: 'America/Chicago', city: 'Houston', state: 'TX', country: 'USA' },
    'dallas': { timezone: 'America/Chicago', city: 'Dallas', state: 'TX', country: 'USA' },
    'phoenix': { timezone: 'America/Phoenix', city: 'Phoenix', state: 'AZ', country: 'USA' },
    'seattle': { timezone: 'America/Los_Angeles', city: 'Seattle', state: 'WA', country: 'USA' },
    'san francisco': { timezone: 'America/Los_Angeles', city: 'San Francisco', state: 'CA', country: 'USA' },
    'portland': { timezone: 'America/Los_Angeles', city: 'Portland', state: 'OR', country: 'USA' },
    // European Cities
    'london': { timezone: 'Europe/London', city: 'London', country: 'UK' },
    'paris': { timezone: 'Europe/Paris', city: 'Paris', country: 'France' },
    'berlin': { timezone: 'Europe/Berlin', city: 'Berlin', country: 'Germany' },
    'rome': { timezone: 'Europe/Rome', city: 'Rome', country: 'Italy' },
    'madrid': { timezone: 'Europe/Madrid', city: 'Madrid', country: 'Spain' },
    'amsterdam': { timezone: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands' },
    'dublin': { timezone: 'Europe/Dublin', city: 'Dublin', country: 'Ireland' },
    'moscow': { timezone: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
    // Asian Cities
    'tokyo': { timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
    'beijing': { timezone: 'Asia/Shanghai', city: 'Beijing', country: 'China' },
    'shanghai': { timezone: 'Asia/Shanghai', city: 'Shanghai', country: 'China' },
    'hong kong': { timezone: 'Asia/Hong_Kong', city: 'Hong Kong', country: 'China' },
    'singapore': { timezone: 'Asia/Singapore', city: 'Singapore', country: 'Singapore' },
    'seoul': { timezone: 'Asia/Seoul', city: 'Seoul', country: 'South Korea' },
    'mumbai': { timezone: 'Asia/Kolkata', city: 'Mumbai', country: 'India' },
    'delhi': { timezone: 'Asia/Kolkata', city: 'Delhi', country: 'India' },
    'dubai': { timezone: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
    // Australian Cities
    'sydney': { timezone: 'Australia/Sydney', city: 'Sydney', country: 'Australia' },
    'melbourne': { timezone: 'Australia/Melbourne', city: 'Melbourne', country: 'Australia' },
    // Other Cities
    'toronto': { timezone: 'America/Toronto', city: 'Toronto', country: 'Canada' },
    'vancouver': { timezone: 'America/Vancouver', city: 'Vancouver', country: 'Canada' },
    'mexico city': { timezone: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico' },
    'sao paulo': { timezone: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil' },
    'buenos aires': { timezone: 'America/Argentina/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina' },
  }

  const lowerQuery = query.toLowerCase().trim()
  const matches: TimezoneData[] = []

  for (const [key, value] of Object.entries(cityMap)) {
    if (key.includes(lowerQuery) || value.city.toLowerCase().includes(lowerQuery)) {
      matches.push({
        id: `${value.timezone}-${Date.now()}-${Math.random()}`,
        city: value.city,
        timezone: value.timezone,
        country: value.country,
        state: value.state,
      })
    }
  }

  // If no matches, try to construct a timezone from the query
  if (matches.length === 0) {
    // Try common timezone patterns
    const timezonePatterns = [
      { pattern: /america\/(.+)/i, prefix: 'America/' },
      { pattern: /europe\/(.+)/i, prefix: 'Europe/' },
      { pattern: /asia\/(.+)/i, prefix: 'Asia/' },
      { pattern: /australia\/(.+)/i, prefix: 'Australia/' },
    ]

    for (const { pattern, prefix } of timezonePatterns) {
      const match = query.match(pattern)
      if (match) {
        const tzName = match[1].replace(/\s+/g, '_')
        matches.push({
          id: `${prefix}${tzName}-${Date.now()}`,
          city: query,
          timezone: `${prefix}${tzName}`,
        })
        break
      }
    }
  }

  return matches
}

