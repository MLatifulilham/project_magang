import db from '../../database/mysql'

export default defineEventHandler(async()=>{
    const [rows]=await db.execute(`
        SELECT
        *
        FROM notifications
        ORDER BY id DESC`
    )
    return{
        success: true,
        message: 'berhasil mengambil data',
        data: rows
    }
})