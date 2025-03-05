import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientMonitor } from "./components/client-monitor";
import "./globals.css";
import Script from "next/script";

// Import site configuration
import siteConfig from "@/data/site_config.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improved font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improved font loading
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  alternates: siteConfig.alternates,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  robots: {
    index: siteConfig.robotsConfig.rules.index,
    follow: siteConfig.robotsConfig.rules.follow,
    googleBot: siteConfig.robotsConfig.googleBot
  },
  applicationName: siteConfig.siteName,
  category: siteConfig.category,
  manifest: siteConfig.manifest,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 2, // Allow slightly more zoom for accessibility
  userScalable: true, // Best for accessibility
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data for better SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": siteConfig.organizationType,
    name: siteConfig.siteName,
    url: siteConfig.url,
    logo: siteConfig.logo,
    sameAs: [
      siteConfig.socialMedia.facebook,
      siteConfig.socialMedia.instagram,
      siteConfig.socialMedia.twitter,
    ],
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    address: siteConfig.address,
    parentOrganization: siteConfig.parentOrganization
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href={siteConfig.url} />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        
        {/* Preconnect to important domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data for SEO */}
        <Script
          id="schema-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <ClientMonitor />
        {children}
      </body>
    </html>
  );
}
