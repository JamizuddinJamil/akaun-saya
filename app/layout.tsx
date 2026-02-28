// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AkaunSaya.my — Rekod Perbelanjaan Saya',
  description: 'Aplikasi rekod perbelanjaan untuk pelbagai perniagaan',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#0d7a5f',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },        // default favicon
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' }, // iOS
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: '#f5f7f6',
          WebkitTapHighlightColor: 'transparent',
          WebkitTextSizeAdjust: '100%',
        }}
      >
        {children}
      </body>
    </html>
  )
}
