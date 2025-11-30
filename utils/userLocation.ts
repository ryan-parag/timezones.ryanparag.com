import { TimezoneData } from '@/types'

/**
 * Maps timezone identifiers to city information
 * This provides a better city name than just extracting from the timezone string
 */
const timezoneToCityMap: Record<string, { city: string; state?: string; country?: string }> = {
  'America/New_York': { city: 'New York', state: 'NY', country: 'USA' },
  'America/Chicago': { city: 'Chicago', state: 'IL', country: 'USA' },
  'America/Denver': { city: 'Denver', state: 'CO', country: 'USA' },
  'America/Los_Angeles': { city: 'Los Angeles', state: 'CA', country: 'USA' },
  'America/Phoenix': { city: 'Phoenix', state: 'AZ', country: 'USA' },
  'America/Anchorage': { city: 'Anchorage', state: 'AK', country: 'USA' },
  'America/Honolulu': { city: 'Honolulu', state: 'HI', country: 'USA' },
  'America/Toronto': { city: 'Toronto', country: 'Canada' },
  'America/Vancouver': { city: 'Vancouver', country: 'Canada' },
  'America/Mexico_City': { city: 'Mexico City', country: 'Mexico' },
  'America/Sao_Paulo': { city: 'São Paulo', country: 'Brazil' },
  'America/Argentina/Buenos_Aires': { city: 'Buenos Aires', country: 'Argentina' },
  'Europe/London': { city: 'London', country: 'UK' },
  'Europe/Paris': { city: 'Paris', country: 'France' },
  'Europe/Berlin': { city: 'Berlin', country: 'Germany' },
  'Europe/Rome': { city: 'Rome', country: 'Italy' },
  'Europe/Madrid': { city: 'Madrid', country: 'Spain' },
  'Europe/Amsterdam': { city: 'Amsterdam', country: 'Netherlands' },
  'Europe/Dublin': { city: 'Dublin', country: 'Ireland' },
  'Europe/Moscow': { city: 'Moscow', country: 'Russia' },
  'Asia/Tokyo': { city: 'Tokyo', country: 'Japan' },
  'Asia/Shanghai': { city: 'Shanghai', country: 'China' },
  'Asia/Hong_Kong': { city: 'Hong Kong', country: 'China' },
  'Asia/Singapore': { city: 'Singapore', country: 'Singapore' },
  'Asia/Seoul': { city: 'Seoul', country: 'South Korea' },
  'Asia/Kolkata': { city: 'Mumbai', country: 'India' },
  'Asia/Dubai': { city: 'Dubai', country: 'UAE' },
  'Australia/Sydney': { city: 'Sydney', country: 'Australia' },
  'Australia/Melbourne': { city: 'Melbourne', country: 'Australia' },
}

/**
 * Gets the user's location information based on their timezone
 */
export function getUserLocation(): TimezoneData {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const cityInfo = timezoneToCityMap[userTimezone]

  if (cityInfo) {
    return {
      id: 'user-time',
      city: cityInfo.city,
      timezone: userTimezone,
      isUserTime: true,
      state: cityInfo.state,
      country: cityInfo.country,
    }
  }

  // Fallback: extract city name from timezone string
  const cityName = userTimezone.split('/').pop()?.replace(/_/g, ' ') || 'Your Location'
  return {
    id: 'user-time',
    city: cityName,
    timezone: userTimezone,
    isUserTime: true,
  }
}

