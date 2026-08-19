import db from '../../database/mysql'

export default defineEventHandler(async () => {
  const [rows] = await db.execute(`
    SELECT
      *
      // id,
      // nama_kategori,
      // keterangan 
    FROM asset_categories
    ORDER BY id DESC
  `)

  return {
    success: true,
    data: rows
  }
})