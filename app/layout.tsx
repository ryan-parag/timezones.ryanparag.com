import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'Timezones',
  description: 'View and manage timezones across the world',
  authors: [{ name: 'Ryan', url: 'https://ryanparag.com' }],
  referrer: 'origin-when-cross-origin',
  creator: 'Ryan Parag',
  keywords: ['timezones', 'world clock', 'time'],
  icons: {
    icon: '/favicon.svg'
  },
  openGraph: {
    title: 'Timezones',
    description: 'View and manage timezones across the world',
    url: 'https://timezones.ryanparag.com',
    siteName: 'Timezones',
    images: [
      {
        url: 'https://timezones.ryanparag.com/og-image.png',
      }
    ]
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
      <html lang="en">
        <body className="font-sans">{children}</body>
      </html>
  )
}


