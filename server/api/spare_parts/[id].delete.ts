import db from '../../database/mysql'

export default defineEventHandler(async (event)=> {
    const id = getRouterParam(event, 'id')
if (!id){
throw createError({
    statusCode: 404,
    statusMessage: 'endpoint harus dengan id'
})
 }
 const [result]: any = await db.execute(
`DELETE FROM spare_parts
WHERE id =?
 `,[id])
 if (result.affectedRows === 0) {
  throw createError({
    statusCode: 404,
    statusMessage: 'lokasi tidak ditemukan'
  })
}


  return {
    success: true,
    message: 'berhasil dihapus'
  }
})