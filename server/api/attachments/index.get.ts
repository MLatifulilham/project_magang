import db from '../../database/mysql'

export default defineEventHandler(async()=> {
    const [row]=await db.execute(`
        SELECT 
    id,
    ticket_id,
    asset_id,
    file_path,
    file_name,
    uploaded_by,
    created_at
    FROM attachments 
        ORDER BY id DESC
        `)

        return{
            success: true,
            data: row
        }
})