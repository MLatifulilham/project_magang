import db from '../../database/mysql'

export default defineEventHandler(async (event)=>{
    const id = getRouterParam(event, 'id') ?? null

    const [rows] = await db.execute(
    `SELECT * FROM tickets WHERE id = ?`,
    [id]
  )

  const logs = rows as any[]

 if (logs.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Data maintenance log tidak ditemukan',
    })
  }

  return {
    success: true,
    data: logs[0],
  }
})