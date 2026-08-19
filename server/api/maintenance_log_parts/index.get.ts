import db from '../../database/mysql'

export default defineEventHandler(async()=>{
    const [row]= await db.execute(
        `SELECT
            *
        // id,
        // maintenance_log_id,
    	// spare_part_id,
       	// jumlah
        FROM maintenance_log_parts
        ORDER BY id DESC
        `
    )
    return{
        success: true,
        data: row
    }
})