import db from '../../database/mysql'

export default defineEventHandler(async(event)=> {
    const id = getRouterParam(event, 'id')

    if (!id){
        throw createError({
            statusCode: 400,
            statusMessage: 'endpoint wajib dengan /id'
        })
    }

    const[rows] = await db.execute(
        `SELECT 
        * 
        FROM maintenance_schedules
        WHERE id = ?`, [id]
    )
    // const row = rows[0];
    const maintenance_schedules = rows as any[]
    if ( maintenance_schedules.length === 0){
        throw createError({
            statusCode: 404,
            statusMessage: 'data g ada'
        })
    }

    return{
        success: true,
        data: maintenance_schedules[0]
}
})