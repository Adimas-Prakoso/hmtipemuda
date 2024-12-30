import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface VerifyRequestBody {
  email: string;
  verificationCode: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  verification_code: string;
  is_verified: boolean;
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hmtipemuda',
};

export async function POST(request: Request) {
  try {
    const { email, verificationCode } = await request.json() as VerifyRequestBody;

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    // Check verification code
    const [rows] = await connection.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ? AND verification_code = ?',
      [email, verificationCode]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { message: 'Kode verifikasi tidak valid' },
        { status: 400 }
      );
    }

    const user = rows[0];

    // Update user verification status
    await connection.execute(
      'UPDATE users SET is_verified = true, verification_code = NULL WHERE id = ?',
      [user.id]
    );

    await connection.end();

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      isVerified: true
    };

    return NextResponse.json({ user: userData });
  } catch (error: unknown) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat verifikasi' },
      { status: 500 }
    );
  }
}
