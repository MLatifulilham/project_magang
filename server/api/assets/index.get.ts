import db from '../../database/mysql'

export default defineEventHandler(async () => {
    const [rows] = await db.execute(`
        SELECT
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
        ORDER BY id DESC  
        `)

    return {
        success: true,
        data: rows
    }
})