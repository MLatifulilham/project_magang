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
        gedung,
        lantai,
        ruangan,
        keterangan
  } = body

  // Validasi
  if (!gedung && !lantai && !ruangan && !keterangan) {
    throw createError({
      statusCode: 400,
      statusMessage: 'data ksosng wajib di isi wajib diisi'
    })
  }

  // Update user
  const [result]: any = await db.execute(
    `
    UPDATE locations
    SET
        gedung,
        lantai,
        ruangan,
        keterangan,
        created_at
    WHERE id = ?
    `,
    [
      gedung,
      lantai,
      ruangan, 
      keterangan || null,
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