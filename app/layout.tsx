import type { Metadata } from 'next'
import './globals.css';

export const metadata: Metadata = {
  title: 'Timezones',
  description: 'View and manage timezones across the world',
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


