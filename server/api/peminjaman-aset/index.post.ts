import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const {
            asset_id,
            peminjam_id,
            tujuan_penggunaan,
            lokasi_tujuan,
            tgl_pinjam,
            tgl_rencana_kembali,
        } = body

        if (
            !asset_id ||
            !peminjam_id ||
            !tujuan_penggunaan ||
            !lokasi_tujuan ||
            !tgl_pinjam ||
            !tgl_rencana_kembali
        ) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'asset_id, peminjam_id, tujuan_penggunaan, lokasi_tujuan, tgl_pinjam, dan tgl_rencana_kembali wajib diisi',
            })
        }

        const [assetRows] = await db.execute('SELECT id FROM assets WHERE id = ? LIMIT 1', [asset_id])
        if ((assetRows as any[]).length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Aset tidak ditemukan' })
        }
        const [userRows] = await db.execute('SELECT id FROM users WHERE id = ? LIMIT 1', [peminjam_id])
        if ((userRows as any[]).length === 0) {
            throw createError({ statusCode: 404, statusMessage: 'Peminjam (user) tidak ditemukan' })
        }

        const [activeLoan] = await db.execute(
            `SELECT id FROM peminjaman_aset WHERE asset_id = ? AND status = 'dipinjam' LIMIT 1`,
            [asset_id],
        )
        if ((activeLoan as any[]).length > 0) {
            throw createError({ statusCode: 409, statusMessage: 'Aset sedang dipinjam pihak lain' })
        }

        const [result]: any = await db.execute(
            `
      INSERT INTO peminjaman_aset (
        asset_id, peminjam_id, tujuan_penggunaan, lokasi_tujuan,
        tgl_pinjam, tgl_rencana_kembali, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'menunggu_persetujuan')
      `,
            [asset_id, peminjam_id, tujuan_penggunaan, lokasi_tujuan, tgl_pinjam, tgl_rencana_kembali],
        )

        return {
            success: true,
            message: 'Pengajuan peminjaman berhasil dicatat',
            id: result.insertId,
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Terjadi kesalahan pada server',
        })
    }
})