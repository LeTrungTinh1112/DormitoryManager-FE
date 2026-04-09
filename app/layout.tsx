import React from "react"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FavoritesProvider } from '@/components/favorites-provider'
import './globals.css'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'KTX Student Housing - Ký túc xá sinh viên',
  description: 'Ký túc xá hiện đại với đầy đủ tiện nghi, an ninh 24/7, giá hợp lý cho sinh viên',
  icons: {
    icon: '/logo.ico',
    apple: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
        <Analytics />
      </body>
    </html>
  )
}
