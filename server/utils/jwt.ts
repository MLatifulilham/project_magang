import jwt from 'jsonwebtoken'

export interface JwtPayload {
  id: number
  email: string
  role: string
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'JWT_SECRET belum diset di server'
    })
  }

  return secret
}

// Membuat JWT
export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), {
    expiresIn: '12h'
  })
}

// Mengecek JWT
export function verifyToken(token: string): JwtPayload {
  let decoded: string | jwt.JwtPayload

  try {
    decoded = jwt.verify(token, getSecret())
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Sesi login sudah berakhir, silakan login ulang'
      })
    }

    throw createError({
      statusCode: 401,
      statusMessage: 'Token tidak valid'
    })
  }

  // Pastikan payload JWT sesuai
  const isValidShape =
    typeof decoded === 'object' &&
    decoded !== null &&
    'id' in decoded &&
    'email' in decoded &&
    'role' in decoded

  if (!isValidShape) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token tidak valid'
    })
  }

  return {
    id: Number((decoded as jwt.JwtPayload).id),
    email: String((decoded as jwt.JwtPayload).email),
    role: String((decoded as jwt.JwtPayload).role)
  }
}

// Mengecek token dari:
// 1. Authorization header
// 2. Cookie token
export function requireAuth(event: any): JwtPayload {
  const authHeader = getHeader(event, 'authorization')

  const tokenFromHeader =
    authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : null

  const tokenFromCookie = getCookie(event, 'token')

  // Prioritaskan Authorization header
  const token = tokenFromHeader || tokenFromCookie

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token tidak ditemukan'
    })
  }

  return verifyToken(token)
}