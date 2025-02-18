import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientMonitor } from "./components/client-monitor";
import "./globals.css";

// Konfigurasi untuk website
const siteConfig = {
  title: "HMTI Pemuda - Himpunan Mahasiswa Teknik Informatika",
  description: "Website resmi Himpunan Mahasiswa Teknik Informatika (HMTI) yang berfokus pada pengembangan softskill dan hardskill mahasiswa informatika",
  url: "https://hmtipemuda.site",
  siteName: "HMTI Pemuda",
  locale: "id-ID",
  type: "website" as const,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  ],
  authors: [
    {
      name: "HMTI Pemuda",
      url: siteConfig.url,
    },
  ],
  creator: "HMTI Pemuda",
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
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: "@hmtipemuda", // Ganti dengan username Twitter sebenarnya
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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
