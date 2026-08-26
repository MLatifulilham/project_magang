import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const {
            user_id,
            judul,
            pesan,
            is_read = false
        } = body

        if (
            user_id === undefined ||
            user_id === null ||
            user_id === '' ||
            !judul ||
            !pesan
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: 'user_id, judul, dan pesan wajib diisi'
            })
        }

        const formatDate = (val: any) => {
            if (!val) return null
            const d = new Date(val)
            return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 19).replace('T', ' ')
        }

        const [result]: any = await db.execute(
            `INSERT INTO notifications (
                user_id,
                judul,
                pesan,
                is_read
            ) VALUES (?, ?, ?, ?)`,
            [
                user_id,
                judul,
                pesan,
                is_read ?? false
            ]
        )

        return {
            success: true,
            message: 'berhasil ditambahkan'
        }

    } catch (error: any) {
        console.error("Notifications Error:", error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.sqlMessage || error.statusMessage || error.message || 'Terjadi kesalahan pada server'
        })
    }
})