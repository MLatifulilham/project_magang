<script setup lang="ts">
definePageMeta({ layout: 'admin' })

interface peminjamanAset {
  id: number
  asset_id: string
  peminjam_id: string
  nama_peminjam: string
  nama_aset: string
  tgl_rencana_kembali: string
  tgl_pinjam: string
}


interface AsetMaintenance {
  id: number
  asset_nama: string
  status_jadwal: string
}


interface Notifikasi {
  id: number
  judul: string
  pesan: string
  created_at: string
}

interface assets {
  status: string
}

interface AssetResponse {
  success: boolean
  message?: string
  data: assets[]
}


interface SparePart {

}

interface SparePartResponse {
  success: boolean
  message?: string
  data: SparePart[]
}

// console.log('data SparePart:',SparePartResponse.vaule )


const formatTanggal = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const lewatMasaTenggang = computed(() => {
  const now = new Date()
  return sedangDipinjam.value.filter((p) => {
    const rencanaKembali = new Date(p.tgl_rencana_kembali)
    return rencanaKembali < now
  }).length
})


const totalpeminjamanaset = computed(() => sedangDipinjam.value.length)
const {
  data: sparePartResponse,
} = await useFetch<SparePartResponse>('/api/spare_parts')

const spareParts = computed(() =>
  sparePartResponse.value?.data || []
)


const {
  data: assetResponse,
} = await useFetch<AssetResponse>('/api/assets')

const totalSparePart = computed(() =>
  spareParts.value.length
)

const assets = computed(() =>
  assetResponse.value?.data || []
)

const totalAset = computed(() => assets.value.length)
const assetRusak = computed(() =>
  assets.value.filter(asset => asset.status === 'rusak').length
)
const assetPerbaikan = computed(() =>
  assets.value.filter(asset => asset.status === 'perbaikan').length
)


const { data: maintenanceRes } = await useFetch<{ data: AsetMaintenance[] }>('/api/maintenance-schedules')
const { data: peminjamanRes } = await useFetch<{ data: peminjamanAset[] }>('/api/peminjaman-aset')
const { data: notifRes } = await useFetch<{ data: Notifikasi[] }>('/api/notifications')

const perluMaintenance = computed(() =>
  (maintenanceRes.value?.data ?? []).filter((m) => m.status_jadwal !== 'Terjadwal'),
)
const sedangDipinjam = computed(() => peminjamanRes.value?.data ?? [])
const informasiTerbaru = computed(() => notifRes.value?.data ?? [])
</script>

<template>
  <div class="p-6">
    <div>
      <h1 class="mb-6 text-2xl font-bold">Dashboard</h1>
    </div>

    <div class="grid grid-cols-6 gap-3 mb-4">
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Di Pinjam</p>
        <p class="text-2xl font-bold mt-2">{{ totalpeminjamanaset }}</p>
      </div>
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Lewat Masa Tenggang</p>
        <p class="text-2xl font-bold mt-2">{{ lewatMasaTenggang }}</p>
      </div>
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Perbaikan</p>
        <p class="text-2xl font-bold mt-2">{{ assetPerbaikan }}</p>
      </div>
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Rusak</p>
        <p class="text-2xl font-bold mt-2">{{ assetRusak }}</p>
      </div>
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Total Aset</p>
        <p class="text-2xl font-bold mt-2">{{ totalAset }}</p>
      </div>
      <div class="border border-gray-300 bg-white p-5 h-24">
        <p class="text-sm text-gray-600">Spare Part</p>
        <p class="text-2xl font-bold mt-2">{{ totalSparePart }}</p>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3">
      <div class="col-span-3 space-y-3">
        <div class="border border-gray-300 bg-white">
          <div class="border-b border-gray-300 px-5 py-4">
            <h2 class="font-semibold">Aset yang perlu maintenance</h2>
          </div>
          <div v-if="perluMaintenance.length === 0" class="h-64 flex items-center justify-center text-gray-400">
            Belum ada aset yang perlu maintenance
          </div>
          

  <div v-else class="overflow-x-auto">
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">Aset</th>
          <th class="border p-3 text-left">Nama</th>
          <th class="border p-3 text-left">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="m in perluMaintenance"
          :key="m.id"
          class="hover:bg-gray-50"
        >
        <td></td>
          <td class="border p-3">
            {{ m.asset_nama }}
          </td>

          <td class="border p-3">
            {{ m.status_jadwal }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  </div>

<div class="border border-gray-300 bg-white">
  <div class="border-b border-gray-300 px-5 py-4">
    <h2 class="font-semibold">Aset yang sedang di pinjam</h2>
  </div>

  <div v-if="sedangDipinjam.length === 0" class="h-64 flex items-center justify-center text-gray-400">
    Belum ada aset yang sedang dipinjam
  </div>

  <div v-else class="overflow-x-auto">
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">aset</th>
          <th class="border p-3 text-left">Nama</th>
          <th class="border p-3 text-left">Peminjam</th>
          <th class="border p-3 text-left">Tanggal Pinjam</th>
          <th class="border p-3 text-left">Rencana Kembali</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="p in sedangDipinjam"
          :key="p.id"
          class="hover:bg-gray-100"
        >

          <td></td>

          <td class="border p-3">
            {{ p.nama_aset }}
          </td>

          <td class="border p-3">
            {{ p.nama_peminjam }}
          </td>

          <td class="border p-3">
            {{ formatTanggal(p.tgl_pinjam) }}
          </td>

          <td class="border p-3">
            {{ formatTanggal(p.tgl_rencana_kembali) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      </div>

      <div class="col-span-1">
        <div class="border border-gray-300 bg-white h-full">
          <div class="border-b border-gray-300 px-5 py-4">
            <h2 class="font-semibold">Informasi Terbaru</h2>
          </div>
          <div v-if="informasiTerbaru.length === 0"
            class="h-[550px] flex items-center justify-center text-gray-400 text-center px-4">
            Belum ada informasi baru
          </div>
          <ul v-else class="divide-y">
            <li v-for="n in informasiTerbaru" :key="n.id" class="px-5 py-3">
              <p class="font-medium text-sm">{{ n.judul }}</p>
              <p class="text-xs text-gray-500">{{ n.pesan }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>