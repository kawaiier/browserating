import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import Script from "next/script";
import StickyAnnouncement from "./components/StickyAnnouncement";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrowseRating - Browser Performance for macOS, Windows and Android",
  description:
    "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results, adblocking quality, and RAM usage. Find the fastest and most efficient browsers for your device.",
  keywords:
    "browser performance, browser benchmark, Speedometer 3, browser comparison, fastest browser, macOS browser, Windows browser, Android browser, adblocking quality, RAM usage",
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
              "description": "Compare performance of macOS, Windows and Android browsers based on Speedometer 3 benchmark results, adblocking quality, and RAM usage.",
            }
          `}
        </Script>
        <Script id="browser-comparison-schema" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Dataset",
              "name": "Browser Performance Comparison",
              "description": "Performance comparison of web browsers across different platforms based on Speedometer 3 benchmark, adblocking quality, and RAM usage.",
              "keywords": ["browser performance", "browser benchmark", "Speedometer 3", "browser comparison", "adblocking quality", "RAM usage"],
              "creator": {
                "@type": "Person",
                "name": "Sergei Manvelov"
              },
              "license": "https://browserating.com/privacy",
              "dateModified": "2025-03-07"
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
