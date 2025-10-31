import type { Metadata } from 'next'
export const dynamic = 'force-dynamic'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NextTamaguiProvider } from './NextTamaguiProvider'
import { MarketplaceHeader } from './_components/header/MarketplaceHeader'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ButterGolf",
  description: "P2P Marketplace for Golf Equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextTamaguiProvider>
          <MarketplaceHeader />
          {children}
        </NextTamaguiProvider>
      </body>
    </html>
  );
}

// Note: Solito navigation works automatically with Next.js App Router
// The Link component from 'solito/link' wraps Next.js Link for cross-platform compatibility
