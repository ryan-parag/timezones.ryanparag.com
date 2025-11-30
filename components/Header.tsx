'use client'

import { useState, useEffect } from 'react'
import { Button } from '@base-ui-components/react/button';
import { Input } from '@base-ui-components/react/input';
import { TimezoneData } from '@/types'
import { searchCity } from '@/utils/timezone'
import { format } from 'date-fns'
import { Globe, Sun, Moon, Clipboard, X, Check } from 'lucide-react'
import moment from 'moment';
import { Separator } from '@base-ui-components/react/separator';

interface HeaderProps {
  onAddTimezone: (timezone: TimezoneData) => void
  is24Hour: boolean
  setIs24Hour: (value: boolean) => void
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  currentTime: Date,
  timezones: any,
  setTimezones: any
}

export default function Header({
  onAddTimezone,
  is24Hour,
  setIs24Hour,
  isDarkMode,
  setIsDarkMode,
  currentTime,
  timezones,
  setTimezones
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TimezoneData[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      searchCity(searchQuery).then((results) => {
        setSearchResults(results)
        setShowResults(true)
      })
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [searchQuery])

  const handleSelectCity = (timezone: TimezoneData) => {
    onAddTimezone(timezone)
    setSearchQuery('')
    setShowResults(false)
  }

  const [copied, setCopied] = useState(false)

  async function copyTextToClipboard() {

    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(window.location.href);
    } else {
      return document.execCommand('copy', true, window.location.href);
    }
  }

  const handleCopy = () => {

    copyTextToClipboard()

  }

  const browserTime = format(currentTime, is24Hour ? 'HH:mm' : 'h:mm aa')
  const browserDate = format(currentTime, 'MM-dd-yyyy')

  return (
    <header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-8 lg:mb-16">
          {/* Logo */}
          <div className="flex items-center gap-1">
            <div className="h-8 w-8">
              <img src="/logo/timezone-ultraman-32.svg" alt="Timezone logo"/>
            </div>
            <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Timezones
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* 12hr/24hr Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 rounded-full p-1 border border-zinc-200 dark:border-zinc-800">
              <Button
                onClick={() => setIs24Hour(false)}
                className={`w-9 py-1 rounded-full text-sm font-medium transition-colors ${
                  !is24Hour
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-950/10 dark:hover:bg-white/10'
                }`}
              >
                12hr
              </Button>
              <Button
                onClick={() => setIs24Hour(true)}
                className={`w-9 py-1 rounded-full text-sm font-medium transition-colors ${
                  is24Hour
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-950/10 dark:hover:bg-white/10'
                }`}
              >
                24hr
              </Button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-zinc-950 rounded-full p-1 border border-zinc-200 dark:border-zinc-800">
              <Button
                onClick={() => setIsDarkMode(false)}
                className={`px-1 py-1 rounded-full text-sm font-medium transition-colors ${
                  !isDarkMode
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-950/10 dark:hover:bg-white/10'
                }`}
              >
                <Sun className="h-5 w-5"/>
              </Button>
              <Button
                onClick={() => setIsDarkMode(true)}
                className={`px-1 py-1 rounded-full text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-950 dark:text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-950/10 dark:hover:bg-white/10'
                }`}
              >
                <Moon className="h-5 w-5"/>
              </Button>
            </div>

            {/* Share Button */}
            <Button
              onClick={() => handleCopy()}
              className="bg-white dark:bg-zinc-950 rounded-full p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-950/10 dark:hover:bg-white/10"
            >
              {
                copied ? (
                  <Check className="h-5 w-5 text-green-700 dark:text-green-500"/>
                )
                :
                (
                  <Clipboard className="h-5 w-5"/>
                )
              }
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-full lg:max-w-sm mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-zinc-500"/>
            </div>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city"
              className={'transition w-full font-sans font-normal leading-5 pr-8 pl-9 py-3 rounded-full shadow-xs border bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:bg-zinc-800 hover:bg-zinc-100 dark:hover:border-zinc-700 focus:border-zinc-800 dark:focus:border-zinc-300 focus:ring-4 focus:ring-primary/30 focus:bg-white dark:focus:bg-zinc-950 focus-visible:outline-0 text-zinc-950 dark:text-white'}
            />
            {
              searchQuery.length > 0 && (
                <button
                  className="absolute transition inset-y-0 top-1/2 -translate-y-1/2 right-2 flex items-center justify-center cursor-pointer rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 w-7 h-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-5 w-5"/>
                </button>
              )
            }
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm max-h-60 overflow-y-auto p-1 gap-px">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectCity(result)}
                  className="w-full px-4 py-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-md"
                >
                  <div className="font-medium text-zinc-950 dark:text-white">
                    {result.city}
                    {result.state && `, ${result.state}`}
                    {result.country && `, ${result.country}`}
                  </div>
                  <div className="text-sm text-zinc-500">
                    {result.timezone}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Browser Time */}
          <div className="pt-3 text-center text-xs text-zinc-500 flex items-center justify-center">
            Your browser time is {browserTime} on {moment(browserDate).format("ddd, MMM DD")}
            {
              timezones.length > 0 && (
                <>
                  <Separator orientation="vertical" className={'w-px h-3 mx-1 bg-zinc-400 dark:bg-zinc-700'} />
                  <Button
                    onClick={() => setTimezones([])}
                    className="underline transition ring-4 ring-transparent hover:text-zinc-800 hover:ring-zinc-200 hover:bg-zinc-200 dark:hover:text-zinc-100 dark:hover:ring-zinc-800 dark:hover:bg-zinc-800 rounded-sm"
                  >
                    Clear all
                  </Button>
                </>
              )
            }
          </div>
        </div>
      </div>
    </header>
  )
}


