import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AkaunSaya.my — Rekod Perbelanjaan Saya',
  description: 'Aplikasi rekod perbelanjaan untuk pelbagai perniagaan',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#0d7a5f" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        background: '#f5f7f6',
        WebkitTapHighlightColor: 'transparent',
        WebkitTextSizeAdjust: '100%',
      }}>
        {children}
      </body>
    </html>
  )
}
