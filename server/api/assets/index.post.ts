import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const {
            kode_aset,
            nama,
            category_id,
            location_id,
            brand,
            model,
            no_serial,
            spesifikasi,
            status,
            penanggung_jawab_id,
            tgl_perolehan,
            harga_perolehan,
            garansi_sampai,
            qr_code,
            catatan
        } = body

        if (
            !kode_aset ||
            !nama ||
            !category_id ||
            !location_id ||
            !no_serial ||
            !status
        ) {
            throw createError({
                statusCode: 400,
                statusMessage:
                    'Kode aset, nama, category_id, location_id, no_serial, dan status wajib diisi'
            })
        }

        const [existingKode] = await db.execute(
            'SELECT id FROM assets WHERE kode_aset = ? LIMIT 1',
            [kode_aset]
        )

        const kodeAset = existingKode as any[]

        if (kodeAset.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'Kode aset sudah digunakan'
            })
        }

        const [existingSerial] = await db.execute(
            'SELECT id FROM assets WHERE no_serial = ? LIMIT 1',
            [no_serial]
        )

        const serialAset = existingSerial as any[]

        if (serialAset.length > 0) {
            throw createError({
                statusCode: 409,
                statusMessage: 'No serial sudah digunakan'
            })
        }

        const [result]: any = await db.execute(
            `
      INSERT INTO assets (
        kode_aset,
        nama,
        category_id,
        location_id,
        brand,
        model,
        no_serial,
        spesifikasi,
        status,
        penanggung_jawab_id,
        tgl_perolehan,
        harga_perolehan,
        garansi_sampai,
        qr_code,
        catatan
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
            [
                kode_aset,
                nama,
                category_id,
                location_id,
                brand || null,
                model || null,
                no_serial,
                spesifikasi || null,
                status,
                penanggung_jawab_id || null,
                tgl_perolehan || null,
                harga_perolehan || null,
                garansi_sampai || null,
                qr_code || null,
                catatan || null
            ]
        )

        return {
            success: true,
            message: 'Asset berhasil ditambahkan',
            data: {
                id: result.insertId,
                kode_aset,
                nama,
                category_id,
                location_id,
                brand: brand || null,
                status
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