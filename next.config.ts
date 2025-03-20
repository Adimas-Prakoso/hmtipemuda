import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi untuk menyembunyikan indikator rute statis (⚡)
  devIndicators: {
    appIsrStatus: false
  },
  // Pindahkan dari experimental.serverComponentsExternalPackages ke serverExternalPackages
  serverExternalPackages: []
};

export default nextConfig;