import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const {
            kode_tiket,
            asset_id,
            pelapor_id,
            judul,
            deskripsi,
            prioritas = 'sedang',
            status = 'open',
            validasi_status = 'menunggu',
            assigned_to
        } = body

        if (
            !kode_tiket ||
            asset_id === undefined ||
            asset_id === null ||
            !pelapor_id ||
            !judul ||
            !deskripsi
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Kode tiket, asset, pelapor, judul, dan deskripsi wajib diisi'
            })
        }

        const formatDate = (val: any) => {
            if (!val) return null
            const d = new Date(val)
            return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 19).replace('T', ' ')
        }

        const [result]: any = await db.execute(
            `INSERT INTO tickets (
                kode_tiket,
                asset_id,
                pelapor_id,
                judul,
                deskripsi,
                prioritas,
                status,
                validasi_status,
                assigned_to
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                kode_tiket,
                asset_id,
                pelapor_id,
                judul,
                deskripsi,
                prioritas,
                status,
                validasi_status,
                assigned_to ?? null
            ]
        )

        return {
            success: true,
            message: 'berhasil ditambahkan'
        }

    } catch (error: any) {
        console.error("tickets Error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.sqlMessage || error.statusMessage || error.message || 'Terjadi kesalahan pada server'
        })
    }
})