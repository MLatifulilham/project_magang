import db from '../../database/mysql'
import { requireAuth } from '../../utils/jwt'

export default defineEventHandler(async (event) => {

    requireAuth(event)

    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID peminjaman wajib diisi'
        })
    }

    const body = await readBody(event)

    const allowFields = [
        'asset_id',
        'peminjam_id',
        'disetujui_oleh',
        'tujuan_penggunaan',
        'lokasi_tujuan',
        'tgl_pinjam',
        'tgl_rencana_kembali',
        'tgl_dikembalikan',
        'status',
        'kondisi_saat_pinjam',
        'kondisi_saat_kembali'
    ]

    const bodyKeys = Object.keys(body)

    const invalidFields = bodyKeys.filter(
        key => !allowFields.includes(key)
    )

    if (invalidFields.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Request ditolak, field tidak sesuai: ${invalidFields.join(', ')}`
        })
    }

    const setClause: string[] = []
    const values: any[] = []

    for (const field of allowFields) {

        if (body[field] !== undefined) {

            setClause.push(`${field} = ?`)

            values.push(body[field])
        }
    }

    if (setClause.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tidak ada data yang diperbarui'
        })
    }

    values.push(id)

    const sqlQuery = `
        UPDATE peminjaman_aset
        SET ${setClause.join(', ')}
        WHERE id = ?
    `

    const [result]: any = await db.execute(
        sqlQuery,
        values
    )

    if (result.affectedRows === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Data peminjaman tidak ditemukan'
        })
    }

    return {
        success: true,
        message: 'Data peminjaman berhasil diperbarui'
    }
})