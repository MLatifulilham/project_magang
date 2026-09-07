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
    FROM asset_categories
    WHERE id = ?
  `,
[id])

    const assetcategories = rows as any[]

  if (assetcategories.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'asset_categories tidak ditemukan'
    })
  }

  return {
    success: true,
    data: rows
  }
})