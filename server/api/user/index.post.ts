import db from '../../database/mysql'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      nama,
      email,
      password,
      role = 'staff', //
      departemen,
      no_telepon
    } = body

    if (!nama || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama, email, dan password wajib diisi'
      })
    }

    const namaClean = String(nama).trim()
    const emailClean = String(email).trim()

    if (namaClean === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama tidak boleh kosong'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailClean)) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Email tidak valid atau email mengandung spasi'
      })
    }

    const [existing] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE LOWER(email) = LOWER(?)
      LIMIT 1
      `,
      [emailClean]
    )

    const existingUsers = existing as any[]

    if (existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email sudah digunakan'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [result]: any = await db.execute(
      `
      INSERT INTO users (
        nama,
        email,
        password_hash,
        role,
        departemen,
        no_telepon
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        namaClean,
        emailClean,
        passwordHash,
        role,
        departemen || null,
        no_telepon || null
      ]
    )

    return {
      success: true,
      message: 'User berhasil ditambahkan',
      data: {
        id: result.insertId,
        nama: namaClean,
        email: emailClean,
        role,
        departemen: departemen || null,
        no_telepon: no_telepon || null
      }
    }

  } catch (error: any) {

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage ||
        'Terjadi kesalahan pada server'
    })
  }
})