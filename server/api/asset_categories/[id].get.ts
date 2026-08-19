import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if(!id){
    throw createError({
    })
  }
  const [rows] = await db.execute(`
    SELECT
      *
      // id,
      // nama_kategori,
      // keterangan 
    FROM asset_categories
    WHERE id = ?
  `,
[id])

    const assetcategories = rows as any[]

  if (assetcategories.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  return {
    success: true,
    data: rows
  }
})