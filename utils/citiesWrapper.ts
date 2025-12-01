// Wrapper to properly export cities data from CommonJS module
// @ts-ignore - cities.js is a CommonJS module
let CITY: any

try {
  CITY = require('./cities.js')
} catch (e) {
  console.error('Failed to load cities.js:', e)
  CITY = { cities: {} }
}

// Ensure we have the cities data - cities.js exports CITY object with .cities property
export const cities = CITY?.cities || {}

