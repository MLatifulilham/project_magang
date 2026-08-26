import db from '../../database/mysql'

export default defineEventHandler(async () => {
    const [rows] = await db.execute(`
        SELECT
        *
        FROM assets
        ORDER BY id DESC  
        `)

    return {
        success: true,
        data: rows
    }
})