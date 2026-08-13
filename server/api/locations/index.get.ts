import db from '../../database/mysql'

export default defineEventHandler(async()=> {
    const [row]=await db.execute(`
        SELECT
        id,
        gedung,
        lantai,
        ruangan,
        keterangan,
        created_at
        FROM locations 
        ORDER BY id DESC
        `)

        return{
            success: true,
            data: row
        }
})