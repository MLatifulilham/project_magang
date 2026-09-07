import db from '../../database/mysql'

export default defineEventHandler(async()=> {
    const [row]=await db.execute(`
        SELECT
      *
        FROM locations 
        ORDER BY id DESC
        `)

        return{
            success: true,
            data: row
        }
})