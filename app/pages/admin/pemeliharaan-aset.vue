<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

interface Jadwal {
  id: number
  asset_id: number
  kode_aset: string
  asset_nama: string
  lokasi: string
  jenis: string
  frekuensi_hari: number
  tgl_terakhir: string | null
  tgl_berikutnya: string
  status_jadwal: 'Segera Maintenance' | 'Perlu Maintenance' | 'Terjadwal'
  is_active: number
}

interface Riwayat {
  id: number
  asset_id: number
  kode_aset: string
  asset_nama: string
  kode_tiket: string | null
  teknisi_nama: string
  jenis: 'preventive' | 'corrective'
  tindakan: string
  biaya: string
  tgl_pelaksanaan: string
}

const tabAktif = ref<'jadwal' | 'riwayat'>('jadwal')

const { data: jadwalRes, pending: jadwalPending } = await useFetch<{ data: Jadwal[] }>(
  '/api/maintenance-schedules',
)
const { data: riwayatRes, pending: riwayatPending } = await useFetch<{ data: Riwayat[] }>(
  '/api/maintenance-logs',
)

const jadwal = computed(() => jadwalRes.value?.data || [])
const riwayat = computed(() => riwayatRes.value?.data || [])

function formatTanggal(dateStr: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatRupiah(value: string): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(
    Number(value),
  )
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Pemeliharaan Aset</h1>
      <p class="text-gray-500">Jadwal pemeliharaan rutin & riwayat perbaikan</p>
    </div>

    <div class="flex gap-2 border-b">
      <button
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px"
        :class="tabAktif === 'jadwal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
        @click="tabAktif = 'jadwal'"
      >
        Jadwal Pemeliharaan
      </button>
      <button
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px"
        :class="tabAktif === 'riwayat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'"
        @click="tabAktif = 'riwayat'"
      >
        Riwayat Perbaikan
      </button>
    </div>

    <!-- ===================== TAB JADWAL ===================== -->
    <div v-if="tabAktif === 'jadwal'" class="bg-white rounded-xl border shadow-sm overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3">Aset</th>
            <th class="text-left px-4 py-3">Lokasi</th>
            <th class="text-left px-4 py-3">Jenis</th>
            <th class="text-left px-4 py-3">Terakhir</th>
            <th class="text-left px-4 py-3">Berikutnya</th>
            <th class="text-center px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="jadwalPending"><td colspan="6" class="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
          <tr v-else-if="jadwal.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-400">Belum ada jadwal pemeliharaan</td>
          </tr>
          <tr v-for="j in jadwal" :key="j.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3">
              <p class="font-medium text-gray-800">{{ j.asset_nama }}</p>
              <p class="text-xs text-gray-500">{{ j.kode_aset }}</p>
            </td>
            <td class="px-4 py-3">{{ j.lokasi }}</td>
            <td class="px-4 py-3">{{ j.jenis }}</td>
            <td class="px-4 py-3">{{ formatTanggal(j.tgl_terakhir) }}</td>
            <td class="px-4 py-3">{{ formatTanggal(j.tgl_berikutnya) }}</td>
            <td class="px-4 py-3 text-center">
              <span
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-red-100 text-red-700': j.status_jadwal === 'Segera Maintenance',
                  'bg-yellow-100 text-yellow-700': j.status_jadwal === 'Perlu Maintenance',
                  'bg-gray-100 text-gray-600': j.status_jadwal === 'Terjadwal',
                }"
              >
                {{ j.status_jadwal }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

 <div v-else class="bg-white rounded-xl border shadow-sm overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-4 py-3">Aset</th>
            <th class="text-left px-4 py-3">Tiket Terkait</th>
            <th class="text-left px-4 py-3">Teknisi</th>
            <th class="text-left px-4 py-3">Jenis</th>
            <th class="text-left px-4 py-3">Tindakan</th>
            <th class="text-right px-4 py-3">Biaya</th>
            <th class="text-left px-4 py-3">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="riwayatPending"><td colspan="7" class="px-4 py-8 text-center text-gray-400">Memuat...</td></tr>
          <tr v-else-if="riwayat.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-gray-400">Belum ada riwayat perbaikan</td>
          </tr>
          <tr v-for="r in riwayat" :key="r.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-3">
              <p class="font-medium text-gray-800">{{ r.asset_nama }}</p>
              <p class="text-xs text-gray-500">{{ r.kode_aset }}</p>
            </td>
            <td class="px-4 py-3">{{ r.kode_tiket || '-' }}</td>
            <td class="px-4 py-3">{{ r.teknisi_nama }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                :class="r.jenis === 'corrective' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'"
              >
                {{ r.jenis }}
              </span>
            </td>
            <td class="px-4 py-3">{{ r.tindakan }}</td>
            <td class="px-4 py-3 text-right">{{ formatRupiah(r.biaya) }}</td>
            <td class="px-4 py-3">{{ formatTanggal(r.tgl_pelaksanaan) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>