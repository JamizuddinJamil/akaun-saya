 import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AkaunSaya.my — Rekod Perbelanjaan Saya',
  description: 'Aplikasi rekod perbelanjaan untuk pelbagai perniagaan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  )
}
