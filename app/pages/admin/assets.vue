<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

interface Assets {
  id: number
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
  file_path: string | null
}

interface AssetResponse {
  success: boolean
  message?: string
  data: Assets[]
}

const { data: assetResponse } =
  await useFetch<AssetResponse>('/api/assets')

const assets = computed(() =>
  assetResponse.value?.data || []
)

const totalAsset = computed(() =>
  assets.value.length
)

const assetAktif = computed(() =>
  assets.value.filter(asset => asset.status === 'aktif').length
)

const assetRusak = computed(() =>
  assets.value.filter(asset => asset.status === 'rusak').length
)

const assetPerbaikan = computed(() =>
  assets.value.filter(asset => asset.status === 'perbaikan').length
)

const assetNonaktif = computed(() =>
  assets.value.filter(asset => asset.status === 'nonaktif').length
)

const search = ref('')

const filterStatus = ref('')

const filteredAssets = computed(() => {
  return assets.value.filter(asset => {

    const cocokSearch =
      asset.nama.toLowerCase().includes(search.value.toLowerCase()) ||
      asset.nama_kategori.toLowerCase().includes(search.value.toLowerCase()) ||
      asset.no_serial.toLowerCase().includes(search.value.toLowerCase())

    const cocokStatus =
      !filterStatus.value ||
      asset.status === filterStatus.value

    return cocokSearch && cocokStatus
  })
  .slice(0,10)
})

</script>

<template>

  <div class="p-6">

    <div class="border border-gray-300 bg-white px-5 py-4 mb-4">
      <h1 class="text-2xl font-semibold">
        Aset kantor
      </h1>
    </div>

    <div class="grid grid-cols-5 gap-3 mb-4">

      <div class="border border-gray-300 bg-white p-4 h-24">
        <p class="text-sm text-gray-600">
          Perbaikan
        </p>
        <p class="text-2xl font-bold mt-2">
          {{ assetPerbaikan }}
        </p>
      </div>

      <div class="border border-gray-300 bg-white p-4 h-24">
        <p class="text-sm text-gray-600">
          Aktif
        </p>
        <p class="text-2xl font-bold mt-2">
          {{ assetAktif }}
        </p>
      </div>

      <div class="border border-gray-300 bg-white p-4 h-24">
        <p class="text-sm text-gray-600">
          Rusak
        </p>
        <p class="text-2xl font-bold mt-2">
          {{ assetRusak }}
        </p>
      </div>

      <div class="border border-gray-300 bg-white p-4 h-24">
        <p class="text-sm text-gray-600">
          Nonaktif
        </p>
        <p class="text-2xl font-bold mt-2">
          {{ assetNonaktif }}
        </p>
      </div>

      <div class="border border-gray-300 bg-white p-4 h-24">
        <p class="text-sm text-gray-600">
          Total Aset
        </p>
        <p class="text-2xl font-bold mt-2">
          {{ totalAsset }}
        </p>
      </div>

    </div>

    <div class="border border-gray-300 bg-white">

      <div class="flex items-center justify-end gap-2 p-3">
        <div class="relative">
          <input
            v-model="search"
            type="text"
            placeholder="Search"
            class="w-48 border border-gray-300 rounded px-3 py-2 text-sm"
          >
        </div>

        <select
          v-model="filterStatus"
          class="border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">
            Filter
          </option>
          <option value="aktif">
            Aktif
          </option>
          <option value="perbaikan">
            Perbaikan
          </option>
          <option value="rusak">
            Rusak
          </option>
          <option value="nonaktif">
            Nonaktif
          </option>
        </select>

        <button
          type="button"
          @click="navigateTo('/admin/tambah-aset/tambah-aset')"
          class="flex h-9 w-9 items-center justify-center rounded-full text-2xl font-bold hover:bg-gray-100"
        >
          +
        </button>

      </div>

      <div class="overflow-x-auto">

        <table class="w-full border-collapse border">

          <thead>
            <tr class="bg-gray-100">

              <th class="border p-3 text-left">
                Aset
              </th>

              <th class="border p-3 text-left">
                Nama
              </th>

              <th class="border p-3 text-left">
                Kategori
              </th>

              <th class="border p-3 text-left">
                Lantai
              </th>

              <th class="border p-3 text-left">
                Ruangan
              </th>

              <th class="border p-3 text-left">
                Tanggal Peroleh
              </th>

              <th class="border p-3 text-left">
                Status
              </th>

            </tr>
          </thead>


          <tbody>

            <tr
              v-for="asset in filteredAssets"
              :key="asset.id"
              class="hover:bg-gray-50"
            >

              <!-- Gambar -->
              <td class="border p-2">

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

              </td>


              <td class="border p-3">
                {{ asset.nama }}
              </td>
              <td class="border p-3">
                {{ asset.nama_kategori }}
              </td>
              <td class="border p-3">
                {{ asset.lantai }}
              </td>
              <td class="border p-3">
                {{ asset.ruangan }}
              </td>
              <td class="border p-3">
                -
              </td>

              <td class="border p-3">
                {{ asset.status }}
              </td>

            </tr>

            <tr v-if="filteredAssets.length === 0">

              <td
                colspan="7"
                class="border p-10 text-center text-gray-400"
              >
                Data aset tidak ditemukan
              </td>

            </tr>

          </tbody>

        </table>

      </div>

      </div>

    </div>

</template>