import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID user wajib diisi'
    })
  }

  const [rows] = await db.execute(
    `
    SELECT
      *
      // id,
      // nama,
      // email,
      // role,
      // departemen,
      // no_telepon,
      // is_active,
      // created_at,
      // updated_at
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