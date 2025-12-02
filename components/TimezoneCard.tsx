'use client'

import { Button } from '@base-ui-components/react/button';
import { TimezoneData } from '@/types'
import { formatTime, formatDate, getGMTOffset, getTimezoneAbbreviation } from '@/utils/timezone'
import { utcToZonedTime } from 'date-fns-tz'
import { Calendar, X } from 'lucide-react'
import moment from 'moment';
import { Separator } from '@base-ui-components/react/separator';

interface TimezoneCardProps {
  timezone: TimezoneData
  currentTime: Date
  is24Hour: boolean,
  dense: boolean,
  onRemove: (id: string) => void
}

export default function TimezoneCard({
  timezone,
  currentTime,
  is24Hour,
  dense,
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
      className={`relative rounded-xl overflow-hidden shadow-sm shadow-zinc-200 dark:shadow-zinc-800 ${dense ? 'px-4 pt-2 pb-6' : 'px-6 pt-4 pb-8'} border ${
        timezone.isUserTime
          ? 'bg-gradient-to-r from-white to-zinc-100 border-zinc-200 text-zinc-950 dark:from-zinc-800 dark:to-zinc-900 dark:text-white dark:border-zinc-800'
          : 'bg-gradient-to-r from-zinc-800 to-zinc-900 border-zinc-800 text-white dark:from-white dark:to-zinc-100 dark:text-zinc-950 dark:border-zinc-200'
      }`}
    >
      {/* Close Button */}
      {!timezone.isUserTime && (
        <Button
          onClick={() => onRemove(timezone.id)}
          className={`absolute ${dense ? 'top-1.5 right-2' : 'top-3 right-4'} p-1 rounded-md text-zinc-400 hover:bg-white/10 hover:text-zinc-200 dark:text-zinc-600 dark:hover:bg-zinc-950/10 dark:hover:text-zinc-700 transition-colors`}
        >
          <X className="h-5 w-5"/>
        </Button>
      )}

      {/* Location */}
      <div className={`flex items-center ${dense ? 'gap-1 mb-1' : 'gap-2 mb-2'}`}>
        <div
          className={`${dense ? 'text-base' : 'text-lg'} font-medium ${
            timezone.isUserTime
              ? 'text-zinc-950 dark:text-white'
              : 'text-white dark:text-zinc-950'
          }`}
        >
          {locationText}
        </div>
        {/* Your Time Badge */}
        {timezone.isUserTime && (
            <span className={`bg-primary/10 text-primary border border-primary/10 font-medium ${dense ? 'uppercase tracking-wide text-[10px] px-1.5 py-[2px]':'text-xs px-3 py-1'} rounded-full`}>
              Your Time
            </span>
        )}
      </div>
      

      <div className={`flex items-center mb-1 ${dense ? 'justify-start' : 'justify-between'}`}>
        {/* Timezone Name */}
        <div
          className={`text-xs ${
            timezone.isUserTime
              ? 'text-zinc-500 dark:text-zinc-500'
              : 'text-zinc-500'
          }`}
        >
          {timezoneName}
        </div>
        {
          dense && (<Separator orientation="vertical" className={'w-px h-2 mx-2 my-0 bg-zinc-400 dark:bg-zinc-700'} />)
        }
        {/* GMT Offset */}
        <div
          className={`text-xs ${
            timezone.isUserTime
              ? 'text-zinc-500 dark:text-zinc-500'
              : 'text-zinc-500'
          }`}
        >
          {gmtOffset}
        </div>
      </div>

      <div className={`flex ${dense ? 'flex-row items-center mb-2 gap-2' : 'flex-col items-start'}`}>
        {/* Current Time */}
        <div
          className={`${dense ? 'text-2xl' : 'text-4xl mb-2'} font-medium ${
            timezone.isUserTime
              ? 'text-zinc-950 dark:text-white'
              : 'text-white dark:text-zinc-950'
          }`}
        >
          {time}
        </div>
        {/* Date */}
        <div
          className={`flex items-center ${dense ? 'gap-1' :'gap-2 mb-6'} text-zinc-500`}
        >
          <Calendar className="h-4 w-4"/>
          <span className="text-xs">{dense ? moment(date).format("ddd, MMM DD") : moment(date).format("dddd, MMMM DD")}</span>
        </div>
      </div>

      {/* Time Slider */}
      <div className={`relative ${dense ? 'px-3' : 'px-1'}`}>
        <div
          className={`h-3 rounded-full bg-transparent`}
        >
          {/* Hour markers */}
          <div className={`relative ${dense ? 'h-0.5' : 'h-3'}`}>
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`absolute ${dense ? 'h-0.5 w-0.5' : 'w-px h-3'} bg-zinc-400 dark:bg-zinc-500`}
                style={{ left: `${(i / 24) * 100}%` }}
              />
            ))}
          </div>

          {/* Current time indicator */}
          <div
            className={`absolute transform -translate-y-1/2 ${dense ? 'w-0.5 h-3 top-0.5' : 'w-0.5 h-6 top-1/2'} bg-primary`}
            style={{ left: `${sliderPosition}%` }}
          />
        </div>

        {/* Hour labels */}
        <div className={`relative ${dense ? 'mt-1' : 'mt-2'}`}>
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
          className={`absolute ${dense ? '-top-1' : 'top-0'} transform -translate-x-1/2`}
          style={{ left: `${sliderPosition}%` }}
        >
          <div className={`text-xs font-normal text-primary mt-[18px] py-0.5 px-1 whitespace-nowrap relative rounded-full overflow-hidde ring-2 ${timezone.isUserTime ? 'ring-white/50 dark:ring-zinc-900/50' : 'ring-zinc-900/50 dark:ring-white/50' }`}>
            {is24Hour
              ? `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
              : currentHour === 0
              ? `12:${currentMinutes.toString().padStart(2, '0')}AM`
              : currentHour === 12
              ? `12:${currentMinutes.toString().padStart(2, '0')}PM`
              : currentHour < 12
              ? `${currentHour}:${currentMinutes.toString().padStart(2, '0')}AM`
              : `${currentHour - 12}:${currentMinutes.toString().padStart(2, '0')}PM`}
              <div className={`rounded-full absolute top-0 bottom-0 left-0 right-0 ${timezone.isUserTime ? 'bg-white/80 dark:bg-zinc-900/80' : 'bg-zinc-900/80 dark:bg-white/80'} -z-10`}/>
          </div>
        </div>
      </div>
    </div>
  )
}

