import db from '../../database/mysql'

export default defineEventHandler(async(event)=>{
   try{
    const body = await readBody(event)
    const{
        maintenance_log_id,
    	spare_part_id,
       	jumlah
    } = body
    if(!maintenance_log_id ||!spare_part_id || !jumlah){
        throw createError({
            statusCode: 400,
            statusMessage: 'data wajib di isi'
        })
    }
        const [result]: any = await db.execute(
            `INSERT INTO maintenance_log_parts (
            maintenance_log_id,
            spare_part_id,
            jumlah
        )
            VALUES (?,?,?) `,
    [maintenance_log_id, spare_part_id, jumlah]
)
     return {
      success: true,
      message: 'berhasil ditambahkan'
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Terjadi kesalahan pada server'
    })
  }
        
   }
)