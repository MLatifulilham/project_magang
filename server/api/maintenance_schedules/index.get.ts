import db from '../../database/mysql'

export default defineEventHandler(async () => {
    const [row] = await db.execute(`
      SELECT 
        *
        // id,
        // asset_id,
        // jenis,
        // frekuensi_hari,
        // tgl_terakhir,
        // tgl_berikutnya,
        // deskripsi,
        // is_active,
        // created_at
      FROM maintenance_schedules
      ORDER BY id DESC
    `)

    return {
      success: true,
      data: row
    }
  }
)