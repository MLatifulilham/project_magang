import db from '../../database/mysql'

export default defineEventHandler(async () => {
  try {
    const [rows] = await db.execute(`
    SELECT
      *
    FROM asset_categories
    ORDER BY id DESC
  `)
    return {
      success: true,
      data: rows
    }
  } catch (error: any) {
    console.error('Error fetching asset categories:', error)
  }

  throw createError({
    statusCode: 500,
    statusMessage: 'Gagal mengambil data kategori aset'
  })
})