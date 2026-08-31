import { verifyToken, createToken } from '~~/server/utils/jwt'

export default defineEventHandler((event) => {
  const authHeader = getHeader(event, 'authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null

  const tokenFromCookie = getCookie(event, 'token')
  const currentToken = tokenFromHeader || tokenFromCookie

  if (!currentToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token tidak ditemukan',
    })
  }

  const payload = verifyToken(currentToken)

  const newToken = createToken({
    id: payload.id,
    email: payload.email,
    role: payload.role,
  })

  setCookie(event, 'token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  })

  return {
    success: true,
    message: 'Token berhasil diperbarui',
    token: newToken,
  }
})