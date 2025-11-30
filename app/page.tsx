'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TimezoneCard from '@/components/TimezoneCard'
import { TimezoneData } from '@/types'

export default function Home() {
  const [timezones, setTimezones] = useState<TimezoneData[]>([])
  const [is24Hour, setIs24Hour] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Load saved timezones from localStorage
    const saved = localStorage.getItem('timezones')
    if (saved) {
      setTimezones(JSON.parse(saved))
    } else {
      // Initialize with user's timezone
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const userCity = userTimezone.split('/').pop()?.replace(/_/g, ' ') || 'Your Location'
      setTimezones([{
        id: 'user-time',
        city: userCity,
        timezone: userTimezone,
        isUserTime: true,
      }])
    }

    // Load preferences
    const saved24Hour = localStorage.getItem('is24Hour')
    if (saved24Hour) setIs24Hour(saved24Hour === 'true')
    
    const savedDarkMode = localStorage.getItem('isDarkMode')
    if (savedDarkMode) setIsDarkMode(savedDarkMode === 'true')

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('isDarkMode', String(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('timezones', JSON.stringify(timezones))
  }, [timezones])

  useEffect(() => {
    localStorage.setItem('is24Hour', String(is24Hour))
  }, [is24Hour])

  const handleAddTimezone = (timezone: TimezoneData) => {
    // Check if timezone already exists
    if (!timezones.find(tz => tz.timezone === timezone.timezone)) {
      setTimezones([...timezones, timezone])
    }
  }

  const handleRemoveTimezone = (id: string) => {
    setTimezones(timezones.filter(tz => tz.id !== id))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Header
        onAddTimezone={handleAddTimezone}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentTime={currentTime}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timezones.map((timezone) => (
            <TimezoneCard
              key={timezone.id}
              timezone={timezone}
              currentTime={currentTime}
              is24Hour={is24Hour}
              onRemove={handleRemoveTimezone}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}


