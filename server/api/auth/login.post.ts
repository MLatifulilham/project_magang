import db from '../../database/mysql'
import bcrypt from 'bcryptjs'
import { createToken } from '~~/server/utils/jwt'
import {
  cekPercobaanLogin,
  catatLoginGagal
} from '../../utils/rate_limit_login'

const dummy_hash = bcrypt.hashSync(
  'dummy-password-untuk-timing-safety',
  10
)

const generic_login_error = {
  statusCode: 401,
  statusMessage: 'Email atau password salah',
}

export default defineEventHandler(async (event) => {
  try {
    const ip =
      getRequestIP(event, { xForwardedFor: true }) || 'unknown'

    cekPercobaanLogin(ip)

    const body = await readBody(event)

    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email dan password wajib diisi',
      })
    }

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
    const user = users[0]

    const hashToCompare = user
      ? user.password_hash
      : dummy_hash

    const passwordValid = await bcrypt.compare(
      password,
      hashToCompare
    )

    const allowedRoles = [
      'admin',
      'teknisi',
      'staff'
    ]

    const loginGagal =
      !user ||
      !passwordValid ||
      !user.is_active ||
      !allowedRoles.includes(user.role)

    if (loginGagal) {
      catatLoginGagal(ip)

      throw createError(generic_login_error)
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    setCookie(event, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 3,
      path: '/',
    })

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        departemen: user.departemen,
        no_telepon: user.no_telepon,
      },
    }

  } catch (error: any) {
    if (
      error.statusCode === 400 ||
      error.statusCode === 401 ||
      error.statusCode === 429
    ) {
      throw error
    }

    console.error('[login] error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan pada server',
    })
  }
})