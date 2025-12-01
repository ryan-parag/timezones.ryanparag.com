import type { Metadata } from 'next'
import Head from 'next/head';
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
        <Head>
          <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
          <link rel="icon" type="image/png" href="/favicon.png"/>
          <meta name="title" content={metadata.title}/>
          <meta name="description" content={metadata.description}/>
          <meta property="og:type" content="website"/>
          <meta property="og:url" content={'https://timezones.ryanparag.com'}/>
          <meta property="og:title" content={metadata.title}/>
          <meta property="og:description" content={metadata.description}/>
          <meta property="og:image" content="/og-image.png"/>
          <meta property="twitter:card" content="summary_large_image"/>
          <meta property="twitter:url" content={'https://timezones.ryanparag.com'}/>
          <meta property="twitter:title" content={metadata.title}/>
          <meta property="twitter:description" content={metadata.description}/>
          <meta property="twitter:image" content="/og-image.png"/>
          <meta name="keywords" content="timezones, world clock, ryan, parag, graphic, web, designer, product"/>
          <meta name="robots" content="index, follow"/>
        </Head>
        <body className="font-sans">{children}</body>
      </html>
  )
}


