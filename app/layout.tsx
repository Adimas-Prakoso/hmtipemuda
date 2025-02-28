import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientMonitor } from "./components/client-monitor";
import "./globals.css";
import Script from "next/script";

// Konfigurasi untuk website
const siteConfig = {
  title: "HMTI Pemuda - Himpunan Mahasiswa Teknik Informatika",
  description: "Website resmi Himpunan Mahasiswa Teknik Informatika (HMTI) yang berfokus pada pengembangan softskill dan hardskill mahasiswa informatika",
  url: "https://hmtipemuda.site",
  siteName: "HMTI Pemuda",
  locale: "id-ID",
  type: "website" as const,
  logo: "https://hmtipemuda.site/logo.png",
  foundingDate: "2020-02-02",
  organizationType: "EducationalOrganization",
};

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
  keywords: [
    "HMTI",
    "Himpunan Mahasiswa",
    "Teknik Informatika",
    "Informatika",
    "Organisasi Mahasiswa",
    "Kampus",
    "Pendidikan",
    "IT",
    "Programming",
    "UBSI",
    "Universitas Bina Sarana Informatika",
    "Mahasiswa IT",
  ],
  authors: [
    {
      name: "HMTI Pemuda",
      url: siteConfig.url,
    },
  ],
  creator: "HMTI Pemuda",
  publisher: "Universitas Bina Sarana Informatika",
  alternates: {
    canonical: "/",
    languages: {
      "id-ID": "/id",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: siteConfig.type,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.siteName,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "HMTI Pemuda - Himpunan Mahasiswa Teknik Informatika",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@hmtipemuda", // Ganti dengan username Twitter sebenarnya
    images: [`${siteConfig.url}/twitter-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  applicationName: siteConfig.siteName,
  verification: {
    // Add these when you have them
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "education",
  manifest: "/manifest.json",
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
      "https://www.facebook.com/hmtipemuda",
      "https://www.instagram.com/hmtipemuda",
      "https://twitter.com/hmtipemuda",
    ],
    description: siteConfig.description,
    foundingDate: siteConfig.foundingDate,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jakarta Barat",
      addressRegion: "DKI Jakarta",
      postalCode: "11730",
      streetAddress: "Jl. Kamal Raya No.18, RT.6/RW.3, Cengkareng Barat",
      addressCountry: "ID"
    },
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "Universitas Bina Sarana Informatika",
      url: "https://www.bsi.ac.id"
    }
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="google-site-verification" content="your-verification-code" />
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
