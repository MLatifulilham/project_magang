// server/api/maintenance-logs/index.get.ts
//
// JOIN 4 tabel: maintenance_logs -> assets, tickets (LEFT JOIN karena
// ticket_id boleh NULL untuk preventive rutin), dan users (nama teknisi).
//
// LEFT JOIN dipakai (bukan JOIN biasa) untuk tickets, karena kalau
// pakai JOIN biasa, baris preventive (ticket_id = NULL) akan HILANG
// dari hasil - padahal itu data valid, cuma tidak berasal dari tiket.

import db from '../../database/mysql'

export default defineEventHandler(async () => {
  const [rows] = await db.execute(`
    SELECT
      log.id,
      log.asset_id,
      log.ticket_id,
      log.teknisi_id,
      log.jenis,
      log.tindakan,
      log.biaya,
      log.tgl_pelaksanaan,
      a.kode_aset,
      a.nama AS asset_nama,
      t.kode_tiket,
      u.nama AS teknisi_nama

    FROM maintenance_logs log
    JOIN assets a ON a.id = log.asset_id
    LEFT JOIN tickets t ON t.id = log.ticket_id
    JOIN users u ON u.id = log.teknisi_id

    ORDER BY log.tgl_pelaksanaan DESC
  `)

  return {
    success: true,
    data: rows,
  }
})