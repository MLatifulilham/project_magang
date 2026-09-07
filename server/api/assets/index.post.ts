import db from '../../database/mysql'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user

    const form = await readMultipartFormData(event)

    if (!form) {
      throw createError({ statusCode: 400, statusMessage: 'Data form tidak ditemukan' })
    }

    const getValue = (name: string) => {
      const item = form.find((item) => item.name === name)
      return item?.data?.toString() || null
    }

    const kode_aset = getValue('kode_aset')
    const nama = getValue('nama')
    const category_id = getValue('category_id')
    const location_id = getValue('location_id')
    const brand = getValue('brand')
    const model = getValue('model')
    const no_serial = getValue('no_serial')
    const spesifikasi = getValue('spesifikasi')
    const status = getValue('status')
    const penanggung_jawab_id = getValue('penanggung_jawab_id')
    const tgl_perolehan = getValue('tgl_perolehan')
    const harga_perolehan = getValue('harga_perolehan')
    const garansi_sampai = getValue('garansi_sampai')
    const qr_code = getValue('qr_code')
    const catatan = getValue('catatan')

    const foto = form.find((item) => item.name === 'foto')

    if (!kode_aset || !nama || !category_id || !location_id || !no_serial || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kode aset, nama, category_id, location_id, no_serial, dan status wajib diisi',
      })
    }

    const [existingKode] = await db.execute('SELECT id FROM assets WHERE kode_aset = ? LIMIT 1', [kode_aset])
    if ((existingKode as any[]).length > 0) {
      throw createError({ statusCode: 409, statusMessage: 'Kode aset sudah digunakan' })
    }

    const [existingSerial] = await db.execute('SELECT id FROM assets WHERE no_serial = ? LIMIT 1', [no_serial])
    if ((existingSerial as any[]).length > 0) {
      throw createError({ statusCode: 409, statusMessage: 'No serial sudah digunakan' })
    }

    const [result]: any = await db.execute(
      `
      INSERT INTO assets (
        kode_aset, nama, category_id, location_id, brand, model, no_serial,
        spesifikasi, status, penanggung_jawab_id, tgl_perolehan,
        harga_perolehan, garansi_sampai, qr_code, catatan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        kode_aset, nama, category_id, location_id, brand, model, no_serial,
        spesifikasi, status, penanggung_jawab_id, tgl_perolehan,
        harga_perolehan, garansi_sampai, qr_code, catatan,
      ],
    )

    const assetId = result.insertId
    let filePath: string | null = null

    if (foto?.data && foto.filename) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'assets')
      await mkdir(uploadDir, { recursive: true })

      const extension = path.extname(foto.filename)
      const fileName = `asset-${assetId}-${Date.now()}${extension}`
      const fullPath = path.join(uploadDir, fileName)

      await writeFile(fullPath, foto.data)
      filePath = `/uploads/assets/${fileName}`

      await db.execute(
        `
        INSERT INTO attachments (asset_id, file_path, file_name, uploaded_by)
        VALUES (?, ?, ?, ?)
        `,
        [assetId, filePath, foto.filename, user.id],
      )
    }

    return {
      success: true,
      message: 'Asset berhasil ditambahkan',
      data: {
        id: assetId, kode_aset, nama, category_id, location_id,
        brand, model, no_serial, status, file_path: filePath,
      },
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Terjadi kesalahan pada server',
    })
  }
})