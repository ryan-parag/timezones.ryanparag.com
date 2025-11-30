'use client'

import { Button } from '@mui/base/Button'
import { TimezoneData } from '@/types'
import { formatTime, formatDate, getGMTOffset, getTimezoneAbbreviation } from '@/utils/timezone'
import { utcToZonedTime } from 'date-fns-tz'
import { Calendar, X } from 'lucide-react'

interface TimezoneCardProps {
  timezone: TimezoneData
  currentTime: Date
  is24Hour: boolean
  onRemove: (id: string) => void
}

export default function TimezoneCard({
  timezone,
  currentTime,
  is24Hour,
  onRemove,
}: TimezoneCardProps) {
  const time = formatTime(currentTime, timezone.timezone, is24Hour)
  const date = formatDate(currentTime, timezone.timezone)
  const gmtOffset = getGMTOffset(currentTime, timezone.timezone)
  const timezoneName = getTimezoneAbbreviation(timezone.timezone)

  // Calculate current time in the timezone
  const zonedTime = utcToZonedTime(currentTime, timezone.timezone)
  const currentHour = zonedTime.getHours()
  const currentMinutes = zonedTime.getMinutes()

  // Calculate position percentage for the slider indicator (using hours + minutes)
  const sliderPosition = ((currentHour + currentMinutes / 60) / 24) * 100

  const locationText = [
    timezone.city,
    timezone.state,
    timezone.country,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div
      className={`relative rounded-xl px-6 pt-4 pb-8 border ${
        timezone.isUserTime
          ? 'bg-gradient-to-r from-white to-zinc-100 border-zinc-200 text-zinc-950 dark:from-zinc-800 dark:to-zinc-900 dark:text-white dark:border-zinc-800'
          : 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-800 text-white dark:from-white dark:to-zinc-100 dark:text-zinc-950 dark:border-zinc-200'
      }`}
    >
      {/* Close Button */}
      {!timezone.isUserTime && (
        <Button
          onClick={() => onRemove(timezone.id)}
          className="absolute top-3 right-4 p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <X className="h-5 w-5"/>
        </Button>
      )}

      {/* Your Time Badge */}
      {timezone.isUserTime && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
            Your Time
          </span>
        </div>
      )}

      {/* Location */}
      <div
        className={`text-lg font-medium mb-2 ${
          timezone.isUserTime
            ? 'text-zinc-950 dark:text-white'
            : 'text-white dark:text-zinc-950'
        }`}
      >
        {locationText}
      </div>

      <div className="flex justify-between">
        {/* Timezone Name */}
        <div
          className={`text-xs mb-1 ${
            timezone.isUserTime
              ? 'text-zinc-500 dark:text-zinc-500'
              : 'text-zinc-500'
          }`}
        >
          {timezoneName}
        </div>

        {/* GMT Offset */}
        <div
          className={`text-xs mb-4 ${
            timezone.isUserTime
              ? 'text-zinc-500 dark:text-zinc-500'
              : 'text-zinc-500'
          }`}
        >
          {gmtOffset}
        </div>
      </div>

      {/* Current Time */}
      <div
        className={`text-4xl font-medium mb-2 ${
          timezone.isUserTime
            ? 'text-zinc-950 dark:text-white'
            : 'text-white dark:text-zinc-950'
        }`}
      >
        {time}
      </div>

      {/* Date */}
      <div
        className={`flex items-center gap-2 mb-6 text-zinc-500`}
      >
        <Calendar className="h-4 w-4"/>
        <span className="text-xs">{date}</span>
      </div>

      {/* Time Slider */}
      <div className="relative px-1">
        <div
          className={`h-3 rounded-full bg-transparent`}
        >
          {/* Hour markers */}
          <div className="relative h-3">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-px h-3 bg-gray-400 dark:bg-gray-500"
                style={{ left: `${(i / 24) * 100}%` }}
              />
            ))}
          </div>

          {/* Current time indicator */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-1 h-5 bg-primary"
            style={{ left: `${sliderPosition}%` }}
          />
        </div>

        {/* Hour labels */}
        <div className="relative mt-2">
          {[0, 6, 12, 18, 24].map((hour) => {
            const label = is24Hour
              ? `${hour.toString().padStart(2, '0')}:00`
              : hour === 0
              ? '12AM'
              : hour === 12
              ? '12PM'
              : hour < 12
              ? `${hour}AM`
              : `${hour - 12}PM`
            return (
              <div
                key={hour}
                className="absolute text-xs transform -translate-x-1/2"
                style={{ left: `${(hour / 24) * 100}%` }}
              >
                <span
                  className={
                    timezone.isUserTime
                      ? 'text-zinc-400 dark:text-zinc-500'
                      : 'text-zinc-400 dark:text-zinc-500'
                  }
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Current hour indicator */}
        <div
          className="absolute top-0 transform -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="text-xs font-normal text-primary mt-4 py-1 px-1 whitespace-nowrap relative rounded-full overflow-hidden">
            {is24Hour
              ? `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
              : currentHour === 0
              ? `12:${currentMinutes.toString().padStart(2, '0')}AM`
              : currentHour === 12
              ? `12:${currentMinutes.toString().padStart(2, '0')}PM`
              : currentHour < 12
              ? `${currentHour}:${currentMinutes.toString().padStart(2, '0')}AM`
              : `${currentHour - 12}:${currentMinutes.toString().padStart(2, '0')}PM`}
              <div className={`absolute top-0 bottom-0 left-0 right-0 ${timezone.isUserTime ? 'bg-white/80 dark:bg-zinc-900/80' : 'bg-zinc-900/80 dark:bg-white/80'} -z-10`}/>
          </div>
        </div>
      </div>
    </div>
  )
}

