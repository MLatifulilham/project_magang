import db from '../../database/mysql'

export default defineEventHandler(async()=>{
    const [row]=await db.execute(`
        SELECT
        *
        // id,
        // asset_id,
        // ticket_id,
        // teknisi_id,
        // jenis,
        // tindakan,
        // biaya,
        // tgl_pelaksanaan,
        // created_at
        FROM maintenance_logs
        ORDER BY id DESC`
    )
    return{
        success: true,
        data: row
    }
})