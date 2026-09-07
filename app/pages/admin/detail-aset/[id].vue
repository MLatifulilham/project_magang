<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const route = useRoute()
const { data, pending, error } = await useFetch<{ data: any }>(`/api/assets/${route.params.id}`)
const asset = computed(() => data.value?.data)

const tanggal = (v: string | null) => v ? new Date(v).toLocaleDateString('id-ID') : '-'
const rupiah = (v: string | number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(v || 0))
</script>

<template>
  <div class="p-6">
    <button @click="navigateTo('/admin/detail-aset/aset-detail')" class="mb-4 text-sm font-medium text-gray-600 hover:text-gray-900">
      ← Kembali
    </button>

    <div v-if="pending" class="py-8 text-center text-gray-500">Memuat...</div>
    <div v-else-if="error || !asset" class="py-8 text-center text-red-500">Aset tidak ditemukan</div>

    <div v-else class="rounded-xl border border-gray-400 bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between border-b border-gray-400 pb-4">
        <div>
          <h1 class="text-xl font-bold text-gray-800">{{ asset.nama }}</h1>
          <p class="text-sm text-gray-500">{{ asset.kode_aset }}</p>
        </div>
        <span class="rounded-full px-3 py-1 text-xs font-semibold capitalize" :class="{
          'bg-green-100 text-green-700': asset.status === 'aktif',
          'bg-red-100 text-red-700': asset.status === 'rusak',
          'bg-yellow-100 text-yellow-700': asset.status === 'perbaikan',
          'bg-gray-100 text-gray-700': asset.status === 'nonaktif'
        }">
          {{ asset.status }}
        </span>
      </div>

      <div class="grid gap-6 py-6 md:grid-cols-2">
        <div class="flex h-64 w-full items-center justify-center overflow-hidden rounded-lg border bg-gray-100">
          <img v-if="asset.file_path" :src="asset.file_path" :alt="asset.nama" class="h-full w-full object-cover">
          <span v-else class="text-sm text-gray-400">Tidak Ada Gambar</span>
        </div>

        <div class="space-y-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <p class="border-b pb-2 font-semibold text-gray-800">Detail & Dokumen</p>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Brand / Model:</span><span class="font-medium">{{ asset.brand || '-' }} {{ asset.model || '' }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Spesifikasi:</span><span class="font-medium">{{ asset.spesifikasi || '-' }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">No. Seri:</span><span class="font-medium">{{ asset.no_serial || '-' }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Tanggal Perolehan:</span><span class="font-medium">{{ tanggal(asset.tgl_perolehan) }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Harga Perolehan:</span><span class="font-medium">{{ rupiah(asset.harga_perolehan) }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Garansi Sampai:</span><span class="font-medium">{{ tanggal(asset.garansi_sampai) }}</span></div>
          <div class="flex justify-between border-b border-gray-500/60 pb-2"><span class="text-gray-500">Lokasi / Ruangan:</span><span class="font-medium">{{ asset.ruangan || '-' }} (Lantai {{ asset.lantai || '-' }})</span></div>
          <div class="flex justify-between"><span class="text-gray-500">Catatan:</span><span class="font-medium">{{ asset.catatan || '-' }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>