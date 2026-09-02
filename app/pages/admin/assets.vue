<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})


interface Asset {
  id: number
  nama: string
  category_id: number
  location_id: number
  brand: string
  model: string
  no_serial: string
  status: string
}

interface AssetResponse {
  success: boolean
  message?: string
  data: Asset[]
}

const {
  data: assetResponse,
  // pending: assetPending,
  // error: assetError
} = await useFetch<AssetResponse>('/api/assets')

const assets = computed(() =>
  assetResponse.value?.data || []
)


interface SparePart {
  id: number
  nama: string
  jumlah: number
  satuan: string
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
} = await useFetch<SparePartResponse>('/api/spare-parts')

const spareParts = computed(() =>
  sparePartResponse.value?.data || []
)


const totalAsset = computed(() =>
  assets.value.length
)

const totalSparePart = computed(() =>
  spareParts.value.length
)

const assetBaik = computed(() =>
  assets.value.filter(asset => asset.status === 'baik').length
)

const assetRusak = computed(() =>
  assets.value.filter(asset => asset.status === 'rusak').length
)

</script>


<template>

  <div class="space-y-6">

    <div>

      <h1 class="text-2xl font-bold text-gray-800">
        Aset Kantor
      </h1>

      <p class="text-gray-500">
        Daftar dan informasi aset kantor
      </p>

    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">

      <div class="space-y-6 xl:col-span-3">

        <section class="overflow-hidden rounded-xl
                 border border-gray-200
                 bg-white shadow-sm">


          <div class="flex items-center justify-between
                   border-b border-gray-200
                   px-5 py-4">

            <div>

              <h2 class="text-lg font-semibold text-gray-800">
                Data Aset
              </h2>

              <p class="text-sm text-gray-500">
                Daftar aset kantor
              </p>

            </div>

            <span class="rounded-full bg-blue-100
                     px-3 py-1 text-sm
                     font-medium text-blue-700">
              {{ totalAsset }} Aset
            </span>

          </div>


          <div class="overflow-x-auto">

            <table class="w-full border-collapse">

              <thead>

                <tr class="bg-gray-50">

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Aset
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Nama
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Kategori
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Lokasi
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>


                <!-- <tr v-if="assetPending">

                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-gray-500"
                  >
                    Memuat data aset...
                  </td>

                </tr> -->


                <!-- <tr v-else-if="assetError">

                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-red-500"
                  >
                    Gagal mengambil data aset.
                  </td>

                </tr> -->


                <tr v-for="asset in assets" :key="asset.id" class="hover:bg-gray-50">

                  <td class="border-b px-4 py-3">
                    {{ asset.id }}
                  </td>

                  <td class="border-b px-4 py-3 font-medium">
                    {{ asset.nama }}
                  </td>

                  <td class="border-b px-4 py-3">
                    {{ asset.category_id }}
                  </td>

                  <td class="border-b px-4 py-3">
                    {{ asset.location_id }}
                  </td>

                  <td class="border-b px-4 py-3">

                    <span class="rounded-full px-3 py-1
                             text-xs font-medium" :class="{
                              'bg-green-100 text-green-700':
                                asset.status === 'baik',

                              'bg-red-100 text-red-700':
                                asset.status === 'rusak',

                              'bg-yellow-100 text-yellow-700':
                                asset.status === 'maintenance'
                            }">
                      {{ asset.status }}
                    </span>

                  </td>

                </tr>



                <!-- <tr v-if="!assetPending && !assetError && assets.length === 0">

                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-gray-500"
                  >
                    Belum ada data aset.
                  </td>

                </tr> -->

              </tbody>

            </table>

          </div>

        </section>

        <section class="overflow-hidden rounded-xl
                 border border-gray-200
                 bg-white shadow-sm">

          <div class="flex items-center justify-between
                   border-b border-gray-200
                   px-5 py-4">

            <div>

              <h2 class="text-lg font-semibold text-gray-800">
                Data Spare Part
              </h2>

              <p class="text-sm text-gray-500">
                Daftar komponen atau suku cadang aset
              </p>

            </div>

            <span class="rounded-full bg-purple-100
                     px-3 py-1 text-sm
                     font-medium text-purple-700">
              {{ totalSparePart }} Spare Part
            </span>

          </div>


          <div class="overflow-x-auto">

            <table class="w-full border-collapse">

              <thead>

                <tr class="bg-gray-50">

                  <th class="border-b px-4 py-3 text-left text-sm">
                    NO
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Nama
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Jumlah
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Satuan
                  </th>

                  <th class="border-b px-4 py-3 text-left text-sm">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>
                <!--             <tr v-if="sparePartPending">

                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-gray-500"
                  >
                    Memuat data spare part...
                  </td>

                </tr> -->


                <!-- <tr v-else-if="sparePartError">

                  <td
                    colspan="5"
                    class="px-4 py-8 text-center text-red-500"
                  >
                    Gagal mengambil data spare part.
                  </td>

                </tr> -->


                <tr v-for="part in spareParts" :key="part.id" class="hover:bg-gray-50">

                  <td class="border-b px-4 py-3">
                    {{ part.id }}
                  </td>

                  <td class="border-b px-4 py-3 font-medium">
                    {{ part.nama }}
                  </td>

                  <td class="border-b px-4 py-3">
                    {{ part.jumlah }}
                  </td>

                  <td class="border-b px-4 py-3">
                    {{ part.satuan }}
                  </td>

                  <td class="border-b px-4 py-3">
                    {{ part.status }}
                  </td>

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

        <div class="rounded-xl
                 border border-gray-200
                 bg-white
                 p-5
                 shadow-sm">

          <p class="text-sm text-gray-500">
            Total Aset
          </p>

          <p class="mt-2 text-3xl font-bold text-gray-800">
            {{ totalAsset }}
          </p>

          <p class="mt-2 text-sm text-gray-500">
            Aset yang terdaftar dalam sistem
          </p>

        </div>

        <div class="rounded-xl
                 border border-gray-200
                 bg-white
                 p-5
                 shadow-sm">

          <p class="text-sm text-gray-500">
            Kondisi Aset
          </p>

          <div class="mt-4 space-y-3">

            <div class="flex justify-between">

              <span class="text-sm text-gray-600">
                Baik
              </span>

              <span class="font-semibold text-green-600">
                {{ assetBaik }}
              </span>

            </div>

            <div class="flex justify-between">

              <span class="text-sm text-gray-600">
                perbaikan
              </span>
              <span class="test-sm text-yellow-600">
                {{ assetRusak }}
              </span>
            </div>

            <div class="flex justify-between">

              <span class="text-sm text-gray-600">
                Rusak
              </span>

              <span class="font-semibold text-red-600">
                {{ assetRusak }}
              </span>
            </div>




          </div>

        </div>

      </div>

    </div>

  </div>

</template>