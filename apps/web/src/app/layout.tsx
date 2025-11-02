import type { Metadata, Viewport } from "next";
export const dynamic = "force-dynamic";
import "./globals.css";
import { NextTamaguiProvider } from "./NextTamaguiProvider";
import { MarketplaceHeader } from "./_components/header/MarketplaceHeader";
import { AppPromoBanner } from "./_components/AppPromoBanner";
import { ServiceWorkerRegistration } from "./_components/ServiceWorkerRegistration";

// Using system fonts for better performance and reliability
const fontVariables = "--font-geist-sans --font-geist-mono";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#13a063",
};

export const metadata: Metadata = {
  title: "ButterGolf",
  description: "P2P Marketplace for Golf Equipment",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ButterGolf",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ButterGolf",
    title: "ButterGolf - P2P Golf Equipment Marketplace",
    description: "Buy and sell golf equipment with fellow golfers",
  },
  other: {
    "apple-itunes-app": "app-id=YOUR_APP_ID", // TODO: Replace with actual App Store ID when available
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTamaguiProvider>
          <ServiceWorkerRegistration />
          <MarketplaceHeader />
          <AppPromoBanner />
          {children}
        </NextTamaguiProvider>
      </body>
    </html>
  );
}

// Note: Solito navigation works automatically with Next.js App Router
// The Link component from 'solito/link' wraps Next.js Link for cross-platform compatibility
