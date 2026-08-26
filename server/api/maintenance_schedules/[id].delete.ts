import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? null

  const [result]: any = await db.execute(
    `
    DELETE FROM maintenance_schedules
    WHERE id = ?
    `,
    [id]
)
if (result.affectedRows === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'id tidak ditemukan'
  })
}


  return {
    success: true,
    message: 'id berhasil dihapus'
  }
})