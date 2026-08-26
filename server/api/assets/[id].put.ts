import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event).catch(() => ({}))

    const allowedFields = [
      'nama',
      'category_id',
      'location_id',
      'brand',
      'model',
      'no_serial',
      'spesifikasi',
      'status',
      'penanggung_jawab_id',
      'tgl_perolehan',
      'harga_perolehan',
      'garansi_sampai',
      'qr_code',
      'catatan',]

    const bodyKeys = Object.keys(body)
    const invalidFields = bodyKeys.filter(key => !allowedFields.includes(key))
    if (invalidFields.length > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: `Request ditolak. Field tidak dikenal: ${invalidFields.join(', ')}`
        })
    }


    // disini handling metode PATCH / PUT
    // PUT: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PUT
    // PATCH: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/PATCH
    const setClause = []
    const values = []

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

    const sqlQuery = `UPDATE assets  SET ${setClause.join(', ')} WHERE id = ?`
    values.push(id)

    const [result]: any = await db.execute(sqlQuery, values)

    if (result.affectedRows === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Asset id tidak ditemukan'
        })
    }

    return {
        success: true,
        message: 'Data asset berhasil diperbarui'
    }
})