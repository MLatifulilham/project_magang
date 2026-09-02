import db from '../../database/mysql'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Belum login'
            })
        }

        const form = await readMultipartFormData(event)

        if (!form) {
            throw createError({
                statusCode: 400,
                statusMessage: 'File wajib dikirim'
            })
        }

        const file = form.find(
            item => item.name === 'foto'
        )

        if (!file || !file.data || !file.filename) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Foto wajib dipilih'
            })
        }

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!allowedTypes.includes(file.type || '')) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Format foto tidak diperbolehkan'
            })
        }

        const maxSize = 2 * 1024 * 1024

        if (file.data.length > maxSize) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Ukuran foto maksimal 2 MB'
            })
        }

        const extensionMap: Record<string, string> = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/webp': '.webp'
        }

        const extension = extensionMap[file.type || '']

        const randomName =
            crypto.randomUUID() + extension

        const uploadDir = path.join(
            process.cwd(),
            'storage',
            'uploads',
            'profiles'
        )

        await mkdir(uploadDir, {
            recursive: true
        })

        const filePath = path.join(
            uploadDir,
            randomName
        )

        await writeFile(
            filePath,
            file.data
        )

        const databasePath =
            `/uploads/profiles/${randomName}`

        await db.execute(
            `
            UPDATE users
            SET foto_profil = ?
            WHERE id = ?
            `,
            [
                databasePath,
                user.id
            ]
        )

        return {
            success: true,
            message: 'Foto profil berhasil diperbarui',
            data: {
                foto_profil: databasePath
            }
        }

    } catch (error: any) {
        console.error(
            'UPLOAD FOTO PROFILE ERROR:',
            error
        )

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage:
                error.statusMessage ||
                error.message ||
                'Gagal mengupload foto'
        })
    }
})