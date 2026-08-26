import db from '../../database/mysql'

export default defineEventHandler(async(event) =>{
    const id = getRouterParam(event, 'id') ?? null
    const [row] =await db.execute(`SELECT 
   *
    FROM spare_parts
    WHERE id = ?`, [id])

    const spare_parts = row as any[]

    if(spare_parts.length === 0){
        throw createError({ statusCode: 404,
            statusMessage:"part tidak ditemukan"
        })
    }

    return{
        succsess: true,
        data: row
    }
})