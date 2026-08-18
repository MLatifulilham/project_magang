import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      gedung,
      ruangan,
      lantai,
      keterangan
    } = body

    // Validasi
    if (
      !ruangan ||
      ruangan.trim() === '' ||
      !lantai
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ruangan dan lantai wajib diisi'
      })
    }

    // Cek apakah ruangan yang sama sudah ada di lantai yang sama
    const [existingRows] = await db.execute(
      `
      SELECT id
      FROM locations
      WHERE LOWER(ruangan) = LOWER(?)
      AND lantai = ?
      LIMIT 1
      `,
      [
        ruangan.trim(),
        lantai
      ]
    )

    const existingLocations = existingRows as any[]

    // Jika kombinasi ruangan + lantai sudah ada
    if (existingLocations.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: `Ruangan ${ruangan} sudah ada di lantai ${lantai}`
      })
    }

    // Insert lokasi
    const [result]: any = await db.execute(
      `
      INSERT INTO locations (
        gedung,
        ruangan,
        lantai,
        keterangan
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        gedung?.trim() || null,
        ruangan.trim(),
        lantai,
        keterangan?.trim() || null
      ]
    )

    return {
      success: true,
      message: 'Lokasi berhasil ditambahkan',
      data: {
        id: result.insertId,
        gedung: gedung || null,
        ruangan,
        lantai,
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