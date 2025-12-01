'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import TimezoneCard from '@/components/TimezoneCard'
import { TimezoneData } from '@/types'
import { getUserLocation } from '@/utils/userLocation'


function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userTime, setUserTime] = useState<TimezoneData | null>(null)
  const [timezones, setTimezones] = useState<TimezoneData[]>([])
  const [is24Hour, setIs24Hour] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize user time (always present)
  useEffect(() => {
    const userLocation = getUserLocation()
    setUserTime(userLocation)
  }, [])

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('timezones')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TimezoneData[]
        // Filter out user-time from localStorage
        const filtered = parsed.filter(tz => !tz.isUserTime)
        setTimezones(filtered)
      } catch (e) {
        console.error('Failed to parse timezones from localStorage:', e)
      }
    }
  }, [])

  // Load timezones from URL params or localStorage
  useEffect(() => {
    if (!userTime) return

    const timezonesParam = searchParams.get('tz')
    if (timezonesParam) {
      try {
        const decoded = decodeURIComponent(timezonesParam)
        const parsed = JSON.parse(decoded) as TimezoneData[]
        // Filter out user-time from URL params and ensure it's not included
        const filtered = parsed.filter(tz => !tz.isUserTime)
        setTimezones(filtered)
      } catch (e) {
        console.error('Failed to parse timezones from URL:', e)
        // Fallback to localStorage
        loadFromLocalStorage()
      }
    } else {
      loadFromLocalStorage()
    }

    // Load preferences
    const saved24Hour = localStorage.getItem('is24Hour')
    if (saved24Hour) setIs24Hour(saved24Hour === 'true')
    
    const savedDarkMode = localStorage.getItem('isDarkMode')
    if (savedDarkMode) setIsDarkMode(savedDarkMode === 'true')

    setIsInitialized(true)
  }, [userTime, searchParams, loadFromLocalStorage])

  // Update URL when timezones change
  const updateURL = useCallback((tzs: TimezoneData[]) => {
    if (!isInitialized) return
    
    const filtered = tzs.filter(tz => !tz.isUserTime)
    if (filtered.length === 0) {
      // Remove timezone param if no timezones
      const url = new URL(window.location.href)
      url.searchParams.delete('tz')
      router.replace(url.pathname + url.search, { scroll: false })
    } else {
      const encoded = encodeURIComponent(JSON.stringify(filtered))
      router.replace(`?tz=${encoded}`, { scroll: false })
    }
  }, [isInitialized, router])

  useEffect(() => {
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
    if (!isInitialized) return
    
    // Save to localStorage (including user-time for backup)
    const allTimezones = userTime ? [userTime, ...timezones] : timezones
    localStorage.setItem('timezones', JSON.stringify(allTimezones))
    
    // Update URL
    updateURL(allTimezones)
  }, [timezones, userTime, isInitialized, updateURL])

  useEffect(() => {
    localStorage.setItem('is24Hour', String(is24Hour))
  }, [is24Hour])

  const handleAddTimezone = (timezone: TimezoneData) => {
    // Don't allow adding user-time
    if (timezone.isUserTime) return
    
    // Check if timezone already exists
    if (!timezones.find(tz => tz.timezone === timezone.timezone)) {
      setTimezones([...timezones, timezone])
    }
  }

  const handleRemoveTimezone = (id: string) => {
    // Don't allow removing user-time
    if (id === 'user-time') return
    setTimezones(timezones.filter(tz => tz.id !== id))
  }

  const [aboutOpen, setAboutOpen] = useState(false);
  const [dense, setDense] = useState(false);

  return (
    <div className={`min-h-screen bg-white dark:bg-zinc-950 ${aboutOpen ? 'overflow-hidden' : 'overflow-auto'}`}>
      {
        aboutOpen && <Sidebar handleClick={setAboutOpen}/>
      }
      <Header
        onAddTimezone={handleAddTimezone}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        currentTime={currentTime}
        timezones={timezones}
        setTimezones={setTimezones}
        setDense={setDense}
        dense={dense}
      />
      <main className="container mx-auto px-4 py-8 lg:min-h-[538px]">
        <div className={`grid grid-cols-1 ${dense ? 'gap-2 lg:gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'gap-6 md:grid-cols-2 lg:grid-cols-3'}`}>
          {/* Always show user-time card first */}
          {userTime && (
            <TimezoneCard
              key={userTime.id}
              timezone={userTime}
              currentTime={currentTime}
              is24Hour={is24Hour}
              onRemove={handleRemoveTimezone}
              dense={dense}
            />
          )}
          {/* Show other timezones */}
          {timezones.map((timezone) => (
            <TimezoneCard
              key={timezone.id}
              timezone={timezone}
              currentTime={currentTime}
              is24Hour={is24Hour}
              onRemove={handleRemoveTimezone}
              dense={dense}
            />
          ))}
        </div>
      </main>
      <Footer handleClick={setAboutOpen} />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500">Loading...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}


