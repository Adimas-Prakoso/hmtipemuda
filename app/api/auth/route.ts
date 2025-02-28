import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admins from "@/data/admin.json";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nim, password } = body;

    // Cari admin dengan NIM yang sesuai
    const admin = admins.find((a) => a.nim === nim);
    if (!admin) {
      return NextResponse.json(
        { error: "NIM atau password salah" },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "NIM atau password salah" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        nim: admin.nim,
        nama: admin.nama,
        role: "admin"
      },
      JWT_SECRET,
      { expiresIn: "30m" }
    );

    // Set response
    const response = NextResponse.json({
      message: "Login berhasil",
      admin: {
        nim: admin.nim,
        nama: admin.nama
      }
    });

    // Set JWT token dalam cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60, // 30 minutes
      path: "/"
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
