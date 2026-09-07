import db from '../../database/mysql'

export default defineEventHandler(async(event)=>{
    const id = getRouterParam(event, 'id') ?? null

    const [rows]=await db.execute(`  SELECT
        *
        FROM assets
        WHERE id = ?
        `,[id])
        
    const assets = rows as any[]

    if(assets.length===0){
        throw createError({
            statusCode: 404,
            statusMessage:'id tidak di temukan'})
        }
    return{
        success: true,
        message: 'berhasil',
        data: assets[0]
    }


})