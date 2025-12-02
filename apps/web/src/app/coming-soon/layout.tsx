import type { Metadata, Viewport } from "next";
import "../globals.css";
import { NextTamaguiProvider } from "../NextTamaguiProvider";
import { Urbanist } from "next/font/google";

// Urbanist font configuration for Pure Butter brand
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-urbanist",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#F45314", // Spiced Clementine
};

export const metadata: Metadata = {
  title: "Coming Soon | ButterGolf",
  description:
    "ButterGolf is launching soon. The smoothest way to buy and sell pre-loved golf equipment.",
};

export default function ComingSoonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`light ${urbanist.variable}`}
    >
      <body className={urbanist.className} style={{ margin: 0, padding: 0 }}>
        <NextTamaguiProvider>{children}</NextTamaguiProvider>
      </body>
    </html>
  );
}
