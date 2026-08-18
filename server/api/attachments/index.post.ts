import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      asset_id,
      file_path,
      file_name,
      uploaded_by
    } = body

    // Validasi
    if (
      !asset_id ||
      !file_path ||
      !file_name ||
      !uploaded_by ||
      String(file_path).trim() === '' ||
      String(file_name).trim() === ''
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'asset_id, file_path, file_name, dan uploaded_by wajib diisi'
      })
    }

    // Cek asset
    const [assetRows] = await db.execute(
      `
      SELECT id
      FROM assets
      WHERE id = ?
      LIMIT 1
      `,
      [asset_id]
    )

    const assets = assetRows as any[]

    if (assets.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Asset tidak ditemukan'
      })
    }

    // Cek user yang mengupload
    const [userRows] = await db.execute(
      `
      SELECT id
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [uploaded_by]
    )

    const users = userRows as any[]

    if (users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User uploader tidak ditemukan'
      })
    }

    // Insert attachment
    const [result]: any = await db.execute(
      `
      INSERT INTO attachments (
        asset_id,
        file_path,
        file_name,
        uploaded_by
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        asset_id,
        String(file_path).trim(),
        String(file_name).trim(),
        uploaded_by
      ]
    )

    return {
      success: true,
      message: 'Attachment berhasil ditambahkan',
      data: {
        id: result.insertId,
        asset_id,
        file_path: String(file_path).trim(),
        file_name: String(file_name).trim(),
        uploaded_by
      }
    }

  } catch (error: any) {
    console.error('ERROR ATTACHMENT:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Terjadi kesalahan pada server'
    })
  }
})