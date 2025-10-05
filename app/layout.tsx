import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import "./globals.css";
import {
  Anton,
  Barlow,
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Smooch_Sans,
} from "next/font/google";
import { Suspense } from "react";
import { Particles } from "@/components/ui/sparkles";

// Initialize fonts
const sans = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// const serif = Instrz({
//   variable: "--font-serif",
//   subsets: ["latin"],
//   weight: ["400"],
// });

export const metadata: Metadata = {
  title: "The BioVerse | NASA Space Biology Knowledge Engine",
  description:
    "Unlocking Decades of NASA Life Science Data for Earth and Space Exploration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* <body className={`font-sans bg-[#000] ${sans.className} ${serif.className} antialiased`}> */}
      <body
        className={`font-sans relative bg-[#000] ${sans.className} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>{children}</Providers>
        </Suspense>
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={80}
          color="#858585"
          refresh
        />
        <Analytics />
      </body>
    </html>
  );
}
