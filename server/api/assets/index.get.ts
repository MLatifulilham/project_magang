import db from '../../database/mysql'
import { requireAuth } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    requireAuth(event)

    const [rows] = await db.execute(`
        SELECT
            a.*,
            ac.nama_kategori,
            l.gedung,
            l.lantai,
            l.ruangan,
            at.file_path


        FROM assets AS a

        LEFT JOIN asset_categories AS ac
            ON a.category_id = ac.id

        LEFT JOIN locations AS l
            ON a.location_id = l.id

        LEFT JOIN attachments AS at
            ON a.id = at.asset_id


        ORDER BY a.id DESC
    `)
    //GROUP BY a.id
    // GROUP_CONCAT(at.file_path) AS file_paths
    return {
        success: true,
        data: rows
    }
})