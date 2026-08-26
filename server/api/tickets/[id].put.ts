//put refaktorisasi
import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
const body = await readBody(event).catch(() => ({}))
    
    const allowedFields = [
        
            "asset_id",
            "ticket_id",
            "teknisi_id",
            "jenis",
            "tindakan",
            "biaya",
            "tgl_pelaksanaan"
        //      id,
        // kode_tiket,
        // asset_id,
        // pelapor_id,
        // judul,
        // deskripsi,
        // prioritas,
        // status,
        // validasi_status,
        // assigned_to,
        // validated_by,
        // validated_at,
        // created_at,
        // updated_at,
        // closed_at
    ]
    const bodyKeys = Object.keys(body)
    const invalidFields = bodyKeys.filter(key => !allowedFields.includes(key))
    if (invalidFields.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Request ditolak. Field tidak di kenal: ${invalidFields.join(',')}`
        })
    }
    const setClause = []
    const values = []

    for (const field of allowedFields) {
        if (body[field] !== undefined) {
            setClause.push(`${field}=?`)
            values.push(body[field])
        }
    }
    if (setClause.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tidak ada data valid yang dikirim untuk diupdate'
        })
    }

    const sqlQuery = `UPDATE maintenance_logs  SET ${setClause.join(', ')} WHERE id = ?`
    values.push(id)

    const [result]: any = await db.execute(sqlQuery, values)

    if (result.affectedRows === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'id tidak ditemukan'
        })
    }

    return {
        success: true,
        message: 'Data id berhasil diperbarui'
    }
})