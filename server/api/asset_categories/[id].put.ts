import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const id = getRouterParam(event, 'id')
        const body = (await readBody(event)) || {}

        const allowedFields = [
            "nama_kategori",
            "keterangan"
        ]

        const bodyKeys = Object.keys(body)
        const invalidFields = bodyKeys.filter(key => !allowedFields.includes(key))

        if (invalidFields.length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: `Request ditolak. Field tidak dikenal: ${invalidFields.join(', ')}`
            })
        }

        const setClause: string[] = []
        const values: any[] = []

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                setClause.push(`${field} = ?`)
                values.push(body[field])
            }
        }

        if (setClause.length === 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Tidak ada data valid yang dikirim untuk diupdate'
            })
        }

        const sqlQuery = `UPDATE asset_categories SET ${setClause.join(', ')} WHERE id = ?`
        values.push(id)

        const [result]: any = await db.execute(sqlQuery, values)

        if (result.affectedRows === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Kategori aset tidak ditemukan'
            })
        }

        return {
            success: true,
            message: 'Kategori aset berhasil diperbarui'
        }

    } catch (error: any) {
        // Tangkap error jika dipicu oleh createError di atas atau error MySQL
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.sqlMessage || error.statusMessage || error.message || 'Terjadi kesalahan pada server'
        })
    }
})