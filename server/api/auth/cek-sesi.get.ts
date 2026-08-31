import { verifyToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Belum login'
    })
  }

  try {
    const payload = verifyToken(token)

    return {
      success: true,
      data: payload
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session tidak valid'
    })
  }
})