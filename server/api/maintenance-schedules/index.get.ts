// server/api/maintenance-schedules/index.get.ts
//
// JOIN 3 tabel: maintenance_schedules -> assets -> locations
// Tujuannya: daripada frontend nampilin cuma "asset_id: 4", table ini
// langsung kasih nama aset & lokasinya lengkap dalam SATU request,
// tanpa frontend perlu fetch terpisah ke /api/assets buat tiap baris.

import db from '../../database/mysql'

export default defineEventHandler(async () => {
  const [rows] = await db.execute(`
    SELECT
      ms.id,
      ms.asset_id,
      ms.jenis,
      ms.frekuensi_hari,
      ms.tgl_terakhir,
      ms.tgl_berikutnya,
      ms.deskripsi,
      ms.is_active,
      a.kode_aset,
      a.nama AS asset_nama,
      CONCAT(l.gedung, ' - ', l.lantai, ' - ', l.ruangan) AS lokasi,
    CASE
        WHEN ms.tgl_berikutnya < CURDATE() THEN 'Segera Maintenance'
        WHEN ms.tgl_berikutnya <= DATE_ADD(CURDATE(), INTERVAL 7 DAY) THEN 'Perlu Maintenance'
        ELSE 'Terjadwal'
      END AS status_jadwal

    FROM maintenance_schedules ms
    JOIN assets a ON a.id = ms.asset_id
    JOIN locations l ON l.id = a.location_id
    ORDER BY ms.tgl_berikutnya ASC
  `)

  return {
    success: true,
    data: rows,
  }
})