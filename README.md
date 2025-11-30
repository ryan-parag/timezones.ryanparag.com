# Timezones - World Clock App

A modern timezone/world clock application built with Next.js, Base UI, and Tailwind CSS. View and manage multiple timezones with a beautiful, responsive interface.

## Features

- 🔍 Search for cities to add timezones
- 🕐 Real-time clock updates
- 🌓 Dark/Light mode toggle
- ⏰ 12-hour and 24-hour time format options
- 📊 Visual time slider for each timezone
- 💾 Local storage persistence
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Base UI** - Component library
- **Tailwind CSS** - Styling
- **date-fns** - Date formatting utilities

## Usage

1. **Add a timezone**: Use the search bar to find and add cities
2. **Remove a timezone**: Click the X button on any timezone card (except "Your Time")
3. **Toggle time format**: Use the 12hr/24hr buttons in the header
4. **Toggle dark mode**: Click the sun/moon icon in the header
5. **Share**: Click the share icon to share the app

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── Header.tsx       # Header with search and controls
│   ├── Footer.tsx       # Footer with About and Github links
│   └── TimezoneCard.tsx # Individual timezone card component
├── utils/
│   └── timezone.ts      # Timezone utility functions
└── types/
    └── index.ts         # TypeScript type definitions
```

## License

MIT


