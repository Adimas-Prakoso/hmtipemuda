import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { query, User } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if email exists in database
    const userResult = await query<User[]>({
      query: 'SELECT * FROM users WHERE email = ?',
      values: [email],
    });

    const user = userResult[0];

    if (!user) {
      return NextResponse.json(
        { message: 'Email tidak ditemukan' },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await query({
      query: 'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
      values: [resetToken, resetTokenExpiry, email],
    });

    // Create reset password URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Configure email transporter
    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Reset Password HMTI Pemuda',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1d4ed8;">Reset Password HMTI Pemuda</h2>
          <p>Anda menerima email ini karena Anda (atau seseorang) telah meminta reset password untuk akun Anda.</p>
          <p>Silakan klik tombol di bawah ini untuk melanjutkan proses reset password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Jika Anda tidak meminta reset password, abaikan email ini dan password Anda akan tetap sama.</p>
          <p>Link reset password ini akan kadaluarsa dalam 1 jam.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Email reset password telah dikirim' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}
