import db from '../../database/mysql'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      nama,
      email,
      password,
      role = 'staff',
      departemen,
      no_telepon
    } = body

    // Validasi
    if (!nama || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama, email, dan password wajib diisi'
      })
    }

    // Cek email
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    const existingUsers = existing as any[]

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email sudah digunakan'
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert
    const [result] = await db.execute(
      `
      INSERT INTO users
      (
        nama,
        email,
        password_hash,
        role,
        departemen,
        no_telepon,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        nama,
        email,
        passwordHash,
        role,
        departemen || null,
        no_telepon || null,
        1
      ]
    )

    return {
      success: true,
      message: 'User berhasil ditambahkan',
      data: result
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Terjadi kesalahan pada server'
    })
  }
})

