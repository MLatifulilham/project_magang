import jwt from 'jsonwebtoken'

interface JwtPayload {
  id: number
  email: string
  role: string
}

export function createToken(payload: JwtPayload) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET belum diset')
  }

  return jwt.sign(payload, secret, {
    expiresIn: '1d'
  })
}

export function verifyToken(token: string) {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET belum diset')
  }

  return jwt.verify(token, secret)
}