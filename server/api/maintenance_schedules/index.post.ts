import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const {
            asset_id,
            jenis,
            frekuensi_hari,
            tgl_terakhir, 
            tgl_berikutnya,
            deskripsi,
            is_active,
            created_at,
        } = body

        if (!jenis || !frekuensi_hari || !tgl_berikutnya) {
            throw createError({
                statusCode: 400,
                statusMessage: 'data wajib di isi'
            })
        }

        const formatDate = (val: any) => {
            if (!val) return null
            const d = new Date(val)
            return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 19).replace('T', ' ')
        }

        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ')

        const [result]: any = await db.execute(
            `INSERT INTO maintenance_schedules (
                asset_id,
                jenis,
                frekuensi_hari,
                tgl_terakhir,
                tgl_berikutnya,
                deskripsi,
                is_active,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [ 
                asset_id ?? null,
                jenis,
                Number(frekuensi_hari),
                formatDate(tgl_terakhir),
                formatDate(tgl_berikutnya),
                deskripsi ?? null,
                is_active !== undefined ? Number(is_active) : 1,
                formatDate(created_at) || currentTimestamp
            ]
        )

        return {
            success: true,
            message: 'berhasil ditambahkan'
        }

    } catch (error: any) {
        console.error("Database Query Error:", error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.sqlMessage || error.message || 'Terjadi kesalahan pada server'
        })
    }
})