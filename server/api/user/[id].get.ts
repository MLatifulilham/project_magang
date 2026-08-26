import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')??null
  const [rows] = await db.execute(
    `
    SELECT
      id,
      nama,
      email,
      role,
      departemen,
      no_telepon,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE id = ?
    `,
    [id]
  )

  const users = rows as any[]

  if (users.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  return {
    success: true,
    data: users[0]
  }
})