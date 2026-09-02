import db from '../../database/mysql'
import { requireAuth } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    // const user = 
    requireAuth(event)
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