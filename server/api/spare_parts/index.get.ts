import db from '../../database/mysql'

export default defineEventHandler(async() =>{
const [row] =await db.execute(`SELECT 
    id,
    nama,
    satuan,
    stok,
    harga_satuan,
    created_at
    FROM spare_parts
    ORDER BY id DESC`)

    return{
        succsess: true,
        data: row
    }
})