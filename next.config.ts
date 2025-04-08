import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk menyembunyikan indikator rute statis (⚡)
  devIndicators: {
    appIsrStatus: false
  },
  // Pindahkan dari experimental.serverComponentsExternalPackages ke serverExternalPackages
  serverExternalPackages: [],
  // Konfigurasi untuk gambar eksternal
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  }
};

export default nextConfig;