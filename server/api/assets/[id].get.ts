import db from '../../database/mysql'

export default defineEventHandler(async(event)=>{
    const id = getRouterParam(event, 'id')

    if(!id){
        throw createError({
            statusCode: 400,
            statusMessage: 'id harus id isi'
            
        })
    }

    const [row]=await db.execute(`  SELECT
       id,
        kode_aset,
        nama,
        category_id,
        location_id,
        brand,
        model,
        no_serial,
        spesifikasi,
        status,
        penanggung_jawab_id,
        tgl_perolehan,
        harga_perolehan,
        garansi_sampai,
        qr_code,
        catatan,
        created_at,
        updated_at
        FROM assets
        WHERE id = ?
        `,[id])
        
    const assets = row as any[]

    if(assets.length===0){
        throw createError({statusCode: 404,
            statusMessage:'data g ada'})
        }
    return{
        success: true,
        data: assets[0]
    }


})