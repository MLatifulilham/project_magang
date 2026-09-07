import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id') ?? null
    const [row] = await db.execute(`
        SELECT 
   *
    FROM peminjaman_aset
    WHERE id = ?`, [id])

    const peminjaman_aset = row as any[]

    if (peminjaman_aset.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: "peminjaman aset tidak ditemukan"
        })
    }

    return {
        success: true,
        data: row
    }
})