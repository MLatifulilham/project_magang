import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const {
      ticket_id,
      asset_id,
      file_path,
      file_name,
      uploaded_by
    } = body

    if (
      ticket_id === undefined ||
      ticket_id === null ||
      ticket_id === '' ||
      asset_id === undefined ||
      asset_id === null ||
      asset_id === '' ||
      !file_path ||
      !file_name ||
      uploaded_by === undefined ||
      uploaded_by === null ||
      uploaded_by === ''
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ticket_id, asset_id, file_path, file_name, dan uploaded_by wajib diisi'
      })
    }

    const [result]: any = await db.execute(
      `
      INSERT INTO attachments (
        ticket_id,
        asset_id,
        file_path,
        file_name,
        uploaded_by
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        ticket_id,
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
        ticket_id,
        asset_id,
        file_path: String(file_path).trim(),
        file_name: String(file_name).trim(),
        uploaded_by
      }
    }

  } catch (error: any) {
    console.error('Attachments Error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.sqlMessage ||
        error.statusMessage ||
        error.message ||
        'Terjadi kesalahan pada server'
    })
  }
})