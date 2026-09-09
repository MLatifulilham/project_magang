<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

interface PeminjamanAset {
  id: number
  asset_id: number
  peminjam_id: number
  nama_peminjam: string
  tgl_pinjam: string
  tgl_rencana_kembali: string
  tgl_dikembalikan: string | null
  kondisi_saat_pinjam: string
  kondisi_saat_kembali: string | null
  tujuan_penggunaan: string
  lokasi_tujuan: string
  nama_aset: string
}

interface ApiResponse {
  success: boolean
  message?: string
  data: PeminjamanAset[]
}

const { data: response } = await useFetch<ApiResponse>('/api/peminjaman-aset')

const peminjamanAset = computed(() => response.value?.data || [])

const formatdate = (dateString: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="mb-6 text-2xl font-bold">Peminjaman Aset</h1>

      <div class="overflow-x-auto">
        <table class="w-full border-collapse border">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-3 text-left">aset</th>
              <th class="border p-3 text-left">Nama aset</th>
              <th class="border p-3 text-left">Peminjam</th>
              <th class="border p-3 text-left">Tanggal Pinjam</th>
              <th class="border p-3 text-left">Rencana Kembali</th>
              <th class="border p-3 text-left">Tanggal Dikembalikan</th>
              <th class="border p-3 text-left">Kondisi Saat Pinjam</th>
              <th class="border p-3 text-left">Kondisi Saat Kembali</th>
              <th class="border p-3 text-left">Tujuan Peminjaman</th>
              <th class="border p-3 text-left">Lokasi Peminjaman</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in peminjamanAset" :key="item.id" class="hover:bg-gray-50">
  <!-- <td class="border p-2">

                <img
                  v-if="asset.file_path"
                  :src="asset.file_path"
                  :alt="asset.nama"
                  class="h-14 w-20 object-cover"
                >

                <div
                  v-else
                  class="h-14 w-20 flex items-center justify-center bg-gray-100 text-xs text-gray-400"
                >
                  Tidak ada
                </div>
</td> -->
              <td></td>
              <td class="border p-3">{{ item.nama_aset }}</td>
              <td class="border p-3">{{ item.nama_peminjam }}</td>
              <td class="border p-3">{{ formatdate(item.tgl_pinjam) }}</td>
              <td class="border p-3">{{ formatdate(item.tgl_rencana_kembali) }}</td>
              <td class="border p-3">{{ formatdate(item.tgl_dikembalikan) || '-' }}</td>
              <td class="border p-3">{{ item.kondisi_saat_pinjam }}</td>
              <td class="border p-3">{{ item.kondisi_saat_kembali || '-' }}</td>
              <td class="border p-3">{{ item.tujuan_penggunaan }}</td>
              <td class="border p-3">{{ item.lokasi_tujuan }}</td>
            </tr>
            <tr v-if="peminjamanAset.length === 0">
              <td colspan="10" class="border p-4 text-center text-gray-500">
                Tidak ada data peminjaman aset.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>