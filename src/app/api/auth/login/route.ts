import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { createTransport } from 'nodemailer';
import bcrypt from 'bcryptjs';

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hmtipemuda',
};

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
  verification_code?: string;
  is_verified: boolean;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json() as LoginRequestBody;

    // Connect to database
    const connection = await mysql.createConnection(dbConfig);

    // Check if user exists
    const [rows] = await connection.execute<UserRow[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await connection.end();
      return NextResponse.json(
        { message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store verification code in database
    await connection.execute(
      'UPDATE users SET verification_code = ? WHERE id = ?',
      [verificationCode, user.id]
    );

    // Send verification code via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login Verification Code',
      text: `Your verification code is: ${verificationCode}`,
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    });

    await connection.end();

    return NextResponse.json({ message: 'Verification code sent' });
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat login' },
      { status: 500 }
    );
  }
}
