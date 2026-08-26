import db from '../../database/mysql'

export default defineEventHandler(async (event)=>{
    const id = getRouterParam(event, 'id') ?? null

    const [rows] = await db.execute(
        `SELECT * FROM maintenance_log_parts 
        WHERE id = ?`,[id]
    )
    const maintenance_log_parts = rows as any[]
    if(maintenance_log_parts.length===0){
        throw createError({
            statusCode: 404,
            statusMessage: 'id tidak di temukan'
        })
    }
    return{
        success: true,
        message:'berhasi',
        data: maintenance_log_parts[0]
    }
})