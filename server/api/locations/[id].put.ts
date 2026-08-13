import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID user wajib diisi'
    })
  }

  const body = await readBody(event)

  const {
        gedung,
        lantai,
        ruangan,
        keterangan
  } = body


  const allowedFields = ["gedung", "ruangan", "lantai", "keterangan"]

  // handling field tidak di kenal (tidak valid)
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
  //   
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

  const sqlQuery = `UPDATE locations SET ${setClause.join(', ')} WHERE id = ?`
  values.push(id)

  const [result]: any = await db.execute(sqlQuery, values)


  // Validasi
  // if (gedung || lantai || ruangan || keterangan) {
  //   throw createError({
  //     statusCode: 400,
  //     statusMessage: 'data ksosng wajib di isi wajib diisi'
  //   })
  // }

  // Update user
  // const [result]: any = await db.execute(
  //   `
  //   UPDATE locations
  //   SET
  //       gedung,
  //       lantai,
  //       ruangan,
  //       keterangan,
  //       created_at
  //   WHERE id = ?
  //   `,
  //   [
  //     gedung ?? null,
  //     lantai ?? null,
  //     ruangan ?? null, 
  //     keterangan || null,
  //     id
  //   ]
  // )

  // Cek apakah user ada
  if (result.affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User tidak ditemukan'
    })
  }

  return {
    success: true,
    message: 'User berhasil diperbarui'
  }
})
