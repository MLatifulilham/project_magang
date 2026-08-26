import db from '../../database/mysql'

export default defineEventHandler(async (event)=>{
    const id = getRouterParam(event,'id') ?? null

    const [result]: any = await db.execute(
        `DELETE FROM notifications
        WHERE id = ? `,
        [id]
    )
    if (result.affectedRows === 0){
        throw createError({
            statusCode: 400,
            statusMessage: 'id tidak ada'
        })
    }
    return{
        success: true,
        message: 'id berhasil di hapus'
    }
})