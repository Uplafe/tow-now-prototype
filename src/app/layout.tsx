import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TowNow – On-Demand Towing',
  description: 'Instant tow truck & roadside assistance at your fingertips',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TowNow',
  },
}

export const viewport: Viewport = {
  themeColor: '#0d1258',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href='https://api.mapbox.com/mapbox-gl-js/v3.5.1/mapbox-gl.css' rel='stylesheet' />
      </head>
        <body className={inter.className}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#0d1258', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
          }}
        />
      </body>
    </html>
  )
}
