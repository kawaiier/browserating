import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BrowseRating - macOS Browser Performance",
  description:
    "Compare performance of macOS browsers based on Speedometer 3 and privacytests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://analytics.kawaiier.dev/tracker.js"
          data-ackee-server="https://analytics.kawaiier.dev"
          data-ackee-domain-id="db904967-c669-4387-b54d-ddaa7ed211a5"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
