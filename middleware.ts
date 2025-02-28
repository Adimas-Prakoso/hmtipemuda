import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("admin_token");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  // Jika ada token, verifikasi validitas token
  if (adminToken) {
    try {
      // Verifikasi JWT token
      const verified = await jwtVerify(
        adminToken.value,
        new TextEncoder().encode(JWT_SECRET)
      );

      // Jika token valid dan mengakses login page, redirect ke dashboard
      if (verified && isLoginPage) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    } catch {
      // Jika token tidak valid atau expired, hapus cookie dan redirect ke login
      console.error("Token verification failed: Invalid or expired token");
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_token");
      return response;
    }
  }

  // Jika mengakses halaman admin (selain login) dan tidak ada token valid, redirect ke login
  if (!adminToken && isAdminPath && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path yang akan dihandle oleh middleware
export const config = {
  matcher: "/admin/:path*"
};
