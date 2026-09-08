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

const {
  data: assetResponse,
} = await useFetch<AssetResponse>('/api/assets')

const assets = computed(() =>
  assetResponse.value?.data || []
)


interface SparePart {
  id: number
  nama: string
  jumlah: number
  satuan: string
  stok: string
  status: string
}

interface SparePartResponse {
  success: boolean
  message?: string
  data: SparePart[]
}

const {
  data: sparePartResponse,
  pending: sparePartPending,
  error: sparePartError
} = await useFetch<SparePartResponse>('/api/spare_parts')

const spareParts = computed(() =>
  sparePartResponse.value?.data || []
)


const totalAsset = computed(() =>
  assets.value.length
)

const totalSparePart = computed(() =>
  spareParts.value.length
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

</script>


<template>

  <div class="space-y-6">

    <div>
      <h2 class="text-lg font-semibold text-gray-800">Data Aset</h2>
      <p class="text-sm text-gray-500">Daftar Aset kantor</p>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">

      <div class="space-y-6 xl:col-span-3">

        <section @click="navigateTo('/admin/detail-aset/aset-detail')" class="overflow-hidden rounded-xl
                    border border-gray-400
                    bg-white shadow-sm
                    cursor-pointer
                    hover:shadow-md
                    transition-shadow">


          <div class="flex items-center justify-between
                   border-b border-gray-400 px-5 py-4">

            <div>

              <h2 class="text-lg font-semibold text-gray-800">Data Aset</h2>

              <p class="text-sm text-gray-500">Daftar aset kantor</p>

            </div>
          </div>

          <div class="overflow-x-auto">
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

                <tr v-for="(asset, index) in assets.slice(0, 5)" :key="asset.id" class="hover:bg-gray-50">

                  <td class="border-b px-4 py-3">
                    <img v-if="asset.file_path" :src="asset.file_path" :alt="asset.nama"
                      class="h-10 w-10 rounded object-cover">
                    <span v-else>-</span>
                  </td>
                  <td class="border-b px-4 py-3 font-medium">{{ asset.nama }}</td>
                  <td class="border-b px-4 py-3">{{ asset.nama_kategori }}</td>
                  <td class="border-b px-4 py-3">{{ asset.lantai }}</td>
                  <td class="border-b px-4 py-3">{{ asset.ruangan }}</td>
                  <td class="border-b px-4 py-3">
                    <span class="rounded-full px-3 py-1 text-xs font-medium" :class="{
                      'bg-green-100 text-gray-600':
                        asset.status === 'aktif',

                      'bg-red-100 text-red-700':
                        asset.status === 'rusak',

                      'bg-yellow-100 text-yellow-700':
                        asset.status === 'perbaikan'
                    }">
                      {{ asset.status }}
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

        <section @click="navigateTo('/admin/detail-spare-part/spare-part-detail')" class="overflow-hidden rounded-xl
                    border border-gray-400
                    bg-white shadow-sm
                    cursor-pointer
                    hover:shadow-md
                    transition-shadow">

          <div class="flex items-center justify-between
                   border-b border-gray-400
                   px-5 py-4">

            <div>
              <h2 class="text-lg font-semibold text-gray-800">Data Spare Part</h2>
              <p class="text-sm text-gray-500">Daftar komponen atau suku cadang aset</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border-b px-4 py-3 text-left text-sm">Spare Part</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Nama</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Jumlah</th>
                  <th class="border-b px-4 py-3 text-left text-sm">Satuan</th>
                </tr>
              </thead>

              <tbody> 
                <tr v-for="part in spareParts.slice(0, 5)" :key="part.id" class="hover:bg-gray-50">
                  <td></td>
                  <td class="border-b px-4 py-3 font-medium">{{ part.nama }}</td>

                  <td class="border-b px-4 py-3">{{ part.stok }}</td>

                  <td class="border-b px-4 py-3">{{ part.satuan }}</td>

                  <td class="border-b px-4 py-3">{{ part.status }}</td>

                </tr>


                <tr v-if="
                  !sparePartPending &&
                  !sparePartError &&
                  spareParts.length === 0
                ">

                  <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                    Belum ada data spare part.
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </div>

      <div class="space-y-6">

        <div class="grid grid-cols-2 gap-6
         rounded-xl
         border border-gray-400
         bg-white
         p-5
         shadow-sm">

          <div>
            <p class="text-sm text-gray-500">
              Total Aset
            </p>

            <p class="mt-2 text-3xl font-bold text-gray-800">
              {{ totalAsset }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">
              Total Part
            </p>

            <p class="mt-2 text-3xl font-bold text-gray-800">
              {{ totalSparePart }}
            </p>

          </div>

        </div>

        <div class="rounded-xl
                 border border-gray-400
                 bg-white
                 p-5
                 shadow-sm">

          <p class="text-sm text-gray-500 text-sm font-semibold">Kondisi Aset</p>
          <div class="mt-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Baik</span>
              <span class="font-semibold">{{ assetAktif }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 text-sm">perbaikan</span>
              <span class="font-semibold ">{{ assetPerbaikan }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 text-sm">Rusak</span>
              <span class="font-semibold">{{ assetRusak }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</template>>