import db from '../../database/mysql'

export default defineEventHandler(async() =>{
const [row] =await db.execute(`SELECT
    *
    FROM asset_categories
    ORDER BY id DESC`)

    return{
      success: true,
      data: row
    }
})





// import db from '../../database/mysql'

// export default defineEventHandler(async () => {
//   try {
// const [rows] = await db.execute(`
//   SELECT 
//     a.id,
//     a.kode_aset,
//     a.nama,
//     a.category_id,
//     ac.nama_kategori,
//     ac.keterangan,
//     a.location_id,
//     l.gedung,
//     l.ruangan,
//     l.lantai,
//     a.status
//   FROM assets a
//   LEFT JOIN asset_categories ac
//     ON a.category_id = ac.id
//   LEFT JOIN locations l
//     ON a.location_id = l.id
//   ORDER BY a.id DESC
// `)
//     return {
//       success: true,
//       data: rows
//     }
//   } catch (error: any) {
//     console.error('Error fetching asset categories:', error)
//   }

//   throw createError({
//     statusCode: 500,
//     statusMessage: 'Gagal mengambil data kategori aset'
//   })
// })