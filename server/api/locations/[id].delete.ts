import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID lokasi wajib diisi'
    })
  }

  const [result]: any = await db.execute(
    `
    DELETE FROM locations
    WHERE id = ?
    `,
    [id]
)
if (result.affectedRows === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'lokasi tidak ditemukan'
  })
}


  return {
    success: true,
    message: 'loaksi berhasil dihapus'
  }
})