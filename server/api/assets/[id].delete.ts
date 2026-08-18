import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID asste wajib diisi'
    })
  }

  const [result]: any = await db.execute(
    `
    DELETE FROM assets
    WHERE id = ?
    `,
    [id]
)
if (result.affectedRows === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Asset tidak ditemukan'
  })
}


  return {
    success: true,
    message: 'Asset berhasil dihapus'
  }
})