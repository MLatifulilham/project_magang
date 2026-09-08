import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                p.id,
                p.asset_id,
                u.nama as nama_peminjam,
                p.disetujui_oleh,
                p.tujuan_penggunaan,
                p.lokasi_tujuan,
                p.tgl_pinjam,
                p.tgl_rencana_kembali,
                p.tgl_dikembalikan,
                p.status,
                p.kondisi_saat_pinjam,
                p.kondisi_saat_kembali,
                a.kode_aset,
                a.nama as nama_aset

                
            FROM peminjaman_aset p

            LEFT JOIN assets a
                ON p.asset_id = a.id

            LEFT JOIN users u
                ON p.peminjam_id = u.id

            ORDER BY p.id DESC
        `)

        return {
            success: true,
            data: rows
        }

    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message || 'Gagal mengambil data peminjaman'
        })
    }
})