import db from '../../database/mysql'
import bcrypt from 'bcryptjs'
import { createToken } from '~~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, password } = body

  // Validasi
  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email dan password wajib diisi'
    })
  }

  // Cari user berdasarkan email
  const [rows] = await db.execute(
    `
    SELECT
      id,
      nama,
      email,
      password_hash,
      role,
      departemen,
      no_telepon,
      is_active
    FROM users
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  )

  const users = rows as any[]

  // User tidak ditemukan
  if (users.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email atau password salah'
    })
  }

  const user = users[0]

  // Cek akun aktif
  if (!user.is_active) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akun tidak aktif'
    })
  }

  // Cek password
  const passwordValid = await bcrypt.compare(
    password,
    user.password_hash
  )

  //validasi token
  const token = createToken({
  id: user.id,
  email: user.email,
  role: user.role
})

  if (!passwordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email atau password salah'
    })
  }

  return {
  success: true,
  message: 'Login berhasil',
  token,
  data: {
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    departemen: user.departemen,
    no_telepon: user.no_telepon
  }
}

})