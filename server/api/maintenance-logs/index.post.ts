import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const {
            asset_id,
            ticket_id,
            teknisi_id,
            jenis,
            tindakan,
            biaya,
            tgl_pelaksanaan
        } = body

        if (
            asset_id === undefined || asset_id === null || asset_id === '' ||
            !jenis ||
            !tindakan ||
            !tgl_pelaksanaan
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Field wajib (asset_id, jenis, tindakan, tgl_pelaksanaan) harus diisi!'
            })
        }

        const formatDate = (val: any) => {
            if (!val) return null
            const d = new Date(val)
            return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 19).replace('T', ' ')
        }

        const [result]: any = await db.execute(
            `INSERT INTO maintenance_logs (
                asset_id,
                ticket_id,
                teknisi_id,
                jenis,
                tindakan,
                biaya,
                tgl_pelaksanaan
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                asset_id,
                ticket_id ?? null,      
                teknisi_id ?? null,    
                jenis,
                tindakan,
                biaya !== undefined && biaya !== null ? Number(biaya) : 0,
                formatDate(tgl_pelaksanaan)
            ]
        )

        return {
            success: true,
            message: 'berhasil ditambahkan'
        }

    } catch (error: any) {
        console.error("Maintenance Log Error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.sqlMessage || error.statusMessage || error.message || 'Terjadi kesalahan pada server'
        })
    }
})