import db from '../../database/mysql'

export default defineEventHandler(async() => {
    const [row] = await db.execute(`
        SELECT 
        id,
        kode_tiket,
        asset_id,
        pelapor_id,
        judul,
        deskripsi,
        prioritas,
        status,
        validasi_status,
        assigned_to,
        validated_by,
        validated_at,
        created_at,
        updated_at,
        closed_at
        FROM tickets
        ORDER BY id DESC`)

    return {
        success: true,
        data: row
    }
})