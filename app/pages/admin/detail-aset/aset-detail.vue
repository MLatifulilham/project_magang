<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

interface Assets {
  id: number
  kode_aset: string
  nama: string
  category_id: number
  location_id: number
  brand: string
  model: string
  nama_kategori: string
  gedung: string
  ruangan: string
  lantai: string
  no_serial: string
  status: string
  file_path?: string
}

interface AssetResponse {
  success: boolean
  message?: string
  data: Assets[]
}

const { data: assetResponse } = await useFetch<AssetResponse>('/api/assets')

const assets = computed(() => assetResponse.value?.data || [])

const search = ref('')
const selectedCategory = ref('')

const categories = computed(() => {
  const data = assets.value
    .map(asset => asset.nama_kategori)
    .filter(Boolean)
  return [...new Set(data)]
})

const filteredAssets = computed(() => {
  return assets.value.filter(asset => {
    const keyword = search.value.toLowerCase()
    const cocokSearch =
      asset.nama.toLowerCase().includes(keyword) ||
      asset.kode_aset.toLowerCase().includes(keyword) ||
      asset.brand?.toLowerCase().includes(keyword) ||
      asset.model?.toLowerCase().includes(keyword)

    const cocokKategori =
      !selectedCategory.value ||
      asset.nama_kategori === selectedCategory.value

    return cocokSearch && cocokKategori
  })
})

const assetAktif = computed(() =>
  assets.value.filter(asset => asset.status === 'aktif').length
)

const assetRusak = computed(() =>
  assets.value.filter(asset => asset.status === 'rusak').length
)

const assetPerbaikan = computed(() =>
  assets.value.filter(asset => asset.status === 'perbaikan').length
)

const tambahAsset = () => {
  navigateTo('/admin/tambah-aset/tambah-aset')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Aset Kantor</h1>
      <p class="text-gray-500">Daftar dan informasi aset kantor</p>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">
      <div class="space-y-6 xl:col-span-3">
        <section class="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
          <div class="flex flex-col gap-4 border-b border-gray-300 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-800">Data Aset</h2>
              <p class="text-sm text-gray-500">Daftar aset kantor</p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <span></span>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Cari aset..."
                  class="w-48 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-500"
                >
              </div>

              <select
                v-model="selectedCategory"
                class="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Semua Kategori</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>

              <button
                type="button"
                @click="tambahAsset"
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-xl text-white transition hover:bg-blue-700"
                title="Tambah Asset"
              >
                +
              </button>
            </div>
          </div>

          <div class="max-h-[500px] overflow-y-auto scrollbar-hide">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border-b px-4 py-3 text-left text-sm">Aset</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Nama</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Kategori</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Lantai</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Ruangan</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="asset in filteredAssets"
                  :key="asset.id"
                  @click="navigateTo(`/admin/detail-aset/${asset.id}`)"
                  class="cursor-pointer hover:bg-gray-50"
                >
                  <td class="border-b px-4 py-3">
                    <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      <img v-if="asset.file_path" :src="asset.file_path" :alt="asset.nama" class="h-full w-full object-cover">
                      <span v-else class="text-xs text-gray-400">-</span>
                    </div>
                  </td>
                  <td class="border-b px-4 py-3 font-medium">
                    <div>{{ asset.nama }}</div>
                    <div class="text-xs text-gray-400">{{ asset.kode_aset }}</div>
                  </td>
                  <td class="border-b px-4 py-3">{{ asset.nama_kategori }}</td>
                  <td class="border-b px-4 py-3">{{ asset.lantai }}</td>
                  <td class="border-b px-4 py-3">{{ asset.ruangan }}</td>
                  <td class="border-b px-4 py-3">
                    <span
                      class="rounded-full px-3 py-1 text-xs font-medium"
                      :class="{
                        'bg-green-100 text-green-700': asset.status === 'aktif',
                        'bg-red-100 text-red-700': asset.status === 'rusak',
                        'bg-yellow-100 text-yellow-700': asset.status === 'perbaikan',
                        'bg-gray-100 text-gray-700': asset.status === 'nonaktif'
                      }"
                    >
                      {{ asset.status }}
                    </span>
                  </td>
                </tr>

                <tr v-if="filteredAssets.length === 0">
                  <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500">
                    Tidak ada aset yang ditemukan.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="rounded-xl border border-gray-300 bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-gray-500">Kondisi Aset</p>
        <div class="mt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Baik</span>
            <span class="text-sm font-semibold text-green-600">{{ assetAktif }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Perbaikan</span>
            <span class="text-sm font-semibold text-yellow-600">{{ assetPerbaikan }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Rusak</span>
            <span class="text-sm font-semibold text-red-600">{{ assetRusak }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>