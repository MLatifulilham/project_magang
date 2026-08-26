import db from '../../database/mysql'

export default defineEventHandler(async () => {
    const [row] = await db.execute(`
      SELECT 
        * 
      FROM maintenance_schedules
      ORDER BY id DESC
    `)
      //Refactoring
    return {
      success: true,
      data: row
    }
  }
)