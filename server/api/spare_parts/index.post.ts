import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      nama,
      satuan,
      stok,
      harga_satuan
    } = body

    if (
        !satuan || !stok || !harga_satuan|| 
        nama.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: ' nama partwajib diisi'
      })
    }

    // Cek apakah kategori sudah ada
    const [existingRows] = await db.execute(
      `
      SELECT id
      FROM spare_parts
      WHERE LOWER(nama) = LOWER(?)
      LIMIT 1
      `,
      [nama.trim()]
    )

    const existingCategories = existingRows as any[]

    if (existingCategories.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Kategori sudah ada'
      })
    }

    const [result]: any = await db.execute(
      `
      INSERT INTO spare_parts (
        nama,
        satuan,
        stok,
        harga_satuan
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        nama.trim(),
        satuan || null,
        stok || null,
        harga_satuan || null
      ]
    )

    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: {
        id: result.insertId,
        nama_kategori: nama.trim(),
        satuan: satuan || null,
        stok: stok || 0,
        harga_satuan: harga_satuan || 0
      }
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.statusMessage || 'Terjadi kesalahan pada server'
    })
  }
})