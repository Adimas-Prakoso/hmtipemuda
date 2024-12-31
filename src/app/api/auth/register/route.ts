import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/dbConfig'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const className = formData.get('class') as string
    const email = formData.get('email') as string
    const campus = formData.get('campus') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const gender = formData.get('gender') as string
    const semester = formData.get('semester') as string
    const reason = formData.get('reason') as string
    const password = formData.get('password') as string
    const photo = formData.get('photo') as File

    // Validate input
    if (!name || !className || !email || !campus || !address || !phone || 
        !gender || !semester || !reason || !password || !photo) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const connection = await pool.getConnection()
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      connection.release()
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Save the photo
    const bytes = await photo.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'images', 'anggota')
    
    // Generate unique filename using timestamp
    const timestamp = new Date().getTime()
    const filename = `${timestamp}-${photo.name}`
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    const photoUrl = `/images/anggota/${filename}`

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user with additional fields
    await connection.query(
      'INSERT INTO users (name, class, email, campus, address, phone, gender, semester, reason, password, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, className, email, campus, address, phone, gender, semester, reason, hashedPassword, photoUrl]
    )

    connection.release()

    return NextResponse.json(
      { message: 'Registrasi berhasil' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat mendaftar' },
      { status: 500 }
    )
  }
}
