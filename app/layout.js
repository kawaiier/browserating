import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import Script from "next/script";
import StickyAnnouncement from "./components/StickyAnnouncement";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://browserating.com"),
  title: "BrowseRating - Browser Performance for macOS, Windows and Android",
  description:
    "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results, adblocking quality, and RAM usage. Find the fastest and most efficient browsers for your device.",
  keywords:
    "browser performance, browser benchmark, Speedometer 3, browser comparison, fastest browser, macOS browser, Windows browser, Android browser, adblocking quality, RAM usage, browser speed test, browser rankings, best browser 2026, browser performance comparison, web browser benchmarks, browser efficiency, browser memory usage, browser testing, browser performance metrics",
  authors: [{ name: "Sergei Manvelov" }],
  openGraph: {
    title: "BrowseRating - Browser Performance Comparison",
    description:
      "Compare browser performance across macOS, Windows and Android based on Speedometer 3 benchmark results, adblocking quality, and RAM usage.",
    url: "https://browserating.com",
    siteName: "BrowseRating",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrowseRating - Browser Performance Comparison",
    description:
      "Compare browser performance across macOS, Windows and Android based on Speedometer 3 benchmark results, adblocking quality, and RAM usage.",
    creator: "@kawaiier101",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#7853E0" />
        <link rel="canonical" href="https://browserating.com" />
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BrowseRating",
              "url": "https://browserating.com",
              "description": "Compare performance of macOS, Windows and Android browsers based on Speedometer 3.1 benchmark results, adblocking quality, and RAM usage.",
              "publisher": {
                "@type": "Organization",
                "name": "BrowseRating",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://browserating.com/images/logo.png"
                }
              }
            }
          `}
        </Script>
        <Script id="organization-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "BrowseRating",
              "url": "https://browserating.com",
              "logo": "https://browserating.com/images/logo.png",
              "sameAs": [
                "https://x.com/kawaiier101",
                "https://t.me/thebrowsershq",
                "https://www.reddit.com/r/aiBrowsing/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "kawaiier@tutanota.com",
                "contactType": "customer support"
              }
            }
          `}
        </Script>
        <Script id="breadcrumb-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://browserating.com"
              }]
            }
          `}
        </Script>
        <Script id="browser-comparison-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Dataset",
              "name": "Browser Performance Comparison 2026",
              "description": "Comprehensive performance comparison of web browsers (Chrome, Firefox, Safari, Edge, Brave, etc.) across macOS, Windows, and Android platforms. Metrics include Speedometer 3.1 scores, RAM consumption, and ad-blocking effectiveness.",
              "keywords": ["browser performance", "browser benchmark", "Speedometer 3.1", "browser comparison", "adblocking quality", "RAM usage", "fastest browser 2026", "macOS browsers", "Windows browsers", "Android browsers"],
              "creator": {
                "@type": "Person",
                "name": "Sergei Manvelov",
                "url": "https://kawaiier.dev"
              },
              "includedInDataCatalog": {
                "@type": "DataCatalog",
                "name": "BrowseRating Data"
              },
              "license": "https://browserating.com/privacy",
              "dateModified": "2026-01-23",
              "version": "1.2.0",
              "isAccessibleForFree": true
            }
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <StickyAnnouncement />
        <Script
          src="https://cdn.counter.dev/script.js"
          data-id="543bdca5-3749-4923-8c4c-1593e1a96e57"
          data-utcoffset="4"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
