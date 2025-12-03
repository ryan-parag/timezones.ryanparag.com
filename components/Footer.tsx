'use client'

import { Github, Info } from 'lucide-react'
import AboutDrawer from './AboutDrawer';

export default function Footer() {

  return (
    <footer className="mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-1">
          <AboutDrawer/>
          <a
            href="https://github.com/ryan-parag/timezones.ryanparag.com"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-950 rounded-full p-1 border border-zinc-200 dark:border-zinc-800 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white transform active:scale-95 active:shadow-inner"
          >
            <Github className="w-5 h-5" />
            <span className="font-medium">Github</span>
          </a>
        </div>
      </div>
    </footer>
  )
}


