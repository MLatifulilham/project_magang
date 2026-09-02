import db from '../../database/mysql'

export default defineEventHandler(async (event) => {
    try {
        const user = event.context.user

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Belum login'
            })
        }

        const [rows] = await db.execute(
            `
            SELECT
                id,
                nama,
                email,
                role,
                departemen,
                no_telepon,
                foto_profil
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [user.id]
        )

        const users = rows as any[]

        if (users.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User tidak ditemukan'
            })
        }

        return {
            success: true,
            data: users[0]
        }

    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage:
                error.statusMessage || 'Terjadi kesalahan pada server'
        })
    }
})