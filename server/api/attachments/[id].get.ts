import db from '../../database/mysql'

export default defineEventHandler(async(event)=>{
const id = getRouterParam(event, 'id')

if(!id){
    throw createError({
    
    })
}
 const [row]=await db.execute(`
    SELECT 
    *
    // id,
    // ticket_id,
    // asset_id,
    // file_path,
    // file_name,
    // uploaded_by,
    // created_at
    FROM attachments 
    WHERE id = ?
    `,
[id])
const locations = row as any[]

    if(locations.length === 0){
        throw createError({statusCode: 404,
        statusMessage:'lokasi tidak di temukan'})
        
    }

        return{
            success: true,
            data: locations[0]
        }
})