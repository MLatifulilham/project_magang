import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID user wajib diisi'
    })
  }

  const body = await readBody(event)

  const {
    nama,
    email,
    role,
    departemen,
    no_telepon,
    is_active
  } = body

  // Validasi
  if (!nama || !email || !role) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nama, email, dan role wajib diisi'
    })
  }

  // Update user
  const [result]: any = await db.execute(
    `
    UPDATE users
    SET
      nama = ?,
      email = ?,
      role = ?,
      departemen = ?,
      no_telepon = ?,
      is_active = ?
    WHERE id = ?
    `,
    [
      nama,
      email,
      role,
      departemen || null,
      no_telepon || null,
      is_active ?? 1,
      id
    ]
  )

  // Cek apakah user ada
  if (result.affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  return {
    success: true,
    message: 'User berhasil diperbarui'
  }
})