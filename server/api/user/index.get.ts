import db from '../../database/mysql'

export default defineEventHandler(async () => {
  const [rows] = await db.execute(`
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
    ORDER BY id DESC
  `)

  return {
    success: true,
    data: rows
  }
})