import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      nama_kategori,
      keterangan
    } = body

    if (!nama_kategori || nama_kategori.trim() === '') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama kategori wajib diisi'
      })
    }

    const [existingRows] = await db.execute(
      `
      SELECT id
      FROM asset_categories
      WHERE LOWER(nama_kategori) = LOWER(?)
      LIMIT 1
      `,
      [nama_kategori.trim()]
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
      INSERT INTO asset_categories (
        nama_kategori,
        keterangan
      )
      VALUES (?, ?)
      `,
      [
        nama_kategori.trim(),
        keterangan || null
      ]
    )

    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: {
        id: result.insertId,
        nama_kategori: nama_kategori.trim(),
        keterangan: keterangan || null
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