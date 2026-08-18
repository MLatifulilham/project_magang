import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 404,
            statusMessage: 'endpoin harus mengunakan id endpoint/id'
        })
    }
    const body = await readBody(event)
    const allowFields = ["nama", "satuan", "stok", "harga_satuan"]

    const bodyKeys = Object.keys(body)
    const invalidFields = bodyKeys.filter(key => !allowFields.includes(key))
    if (invalidFields.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `reques di tolak, fild g sesuai: ${invalidFields.join(', ')}`
        })
    }

    const setClause = []
    const values = []

    for (const field of allowFields) {
        if (body[field] !== undefined) {
            setClause.push(`${field}=?`)
            values.push(body[field])
        }
    }

    const sqlQuery = `UPDATE spare_parts SET ${setClause.join(', ')}  WHERE id = ?`
    values.push(id)
    const [result]: any = await db.execute(sqlQuery, values)

    if (result.affectedRows === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'part tidak ditemukan'
        })
    }

    return {
        success: true,
        message: 'Data part berhasil diperbarui'
    }
})