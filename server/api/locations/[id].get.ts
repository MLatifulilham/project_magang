import db from '../../database/mysql'

export default defineEventHandler(async(event)=> {
    const id = getRouterParam(event, 'id')

    if(!id){
        throw createError({
            statusCode: 400,
            statusMessage: 'id barang harus di isi'
        })
    }

    const [row]=await db.execute(`
        SELECT
        id,
        gedung,
        lantai,
        ruangan,
        keterangan,
        created_at
        FROM locations 
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