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

</script>


<template>

    <div class="space-y-6">

        <div>

            <h1 class="text-2xl font-bold text-gray-800">Aset Kantor</h1>

            <p class="text-gray-500">Daftar dan informasi aset kantor</p>

        </div>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-4">

            <div class="space-y-6 xl:col-span-3">

                 <section class="overflow-hidden rounded-xl
                 border border-gray-200
                 bg-white shadow-sm">

                    <div class="flex items-center justify-between
                   border-b border-gray-200 px-5 py-4">

                        <div>

                            <h2 class="text-lg font-semibold text-gray-800">Data Aset</h2>

                            <p class="text-sm text-gray-500">Daftar aset kantor</p>

                        </div>
                    </div>

                    <div class="max-h-[500px] overflow-y-auto scrollbar-hide">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="border-b px-4 py-3 text-left text-sm">Aset</th>
                                    <th class="border-b px-4 py-3 text-left text-sm">Nama</th>
                                    <th class="border-b px-4 py-3 text-left text-sm">Kategori</th>
                                    <!-- <th class="border-b px-4 py-3 text-left text-sm">
                    Gedung
                  </th> -->
                                    <th class="border-b px-4 py-3 text-left text-sm">Lantai</th>
                                    <th class="border-b px-4 py-3 text-left text-sm">Ruangan</th>
                                    <th class="border-b px-4 py-3 text-left text-sm">Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr v-for="(asset, index) in assets.slice(0, 10)"
                                    :key="asset.id"
                                    @click="navigateTo(`/admin/detail-spare-part/${asset.id}`)"
                                    class="cursor-pointer hover:bg-gray-50">

                                    <td></td>
                                    <td class="border-b px-4 py-3 font-medium">{{ asset.nama }}</td>
                                    <td class="border-b px-4 py-3">{{ asset.nama_kategori }}</td>
                                    <!-- <td class="border-b px-4 py-3">{{ asset.gedung }}</td> -->
                                    <td class="border-b px-4 py-3">{{ asset.lantai }}</td>
                                    <td class="border-b px-4 py-3">{{ asset.ruangan }}</td>
                                    <td class="border-b px-4 py-3">
                                        <span class="rounded-full px-3 py-1 text-xs font-medium" :class="{
                                            'bg-green-100 text-green-700':
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


            </div>

        <div class="rounded-xl
                 border border-gray-200
                 bg-white
                 p-5
                 shadow-sm">

          <p class="text-sm text-gray-500 text-sm font-semibold">Kondisi Aset</p>
          <div class="mt-4 space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Baik</span>
              <span class="font-semibold text-green-600 text-sm">{{ assetAktif }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 text-sm">perbaikan</span>
              <span class="font-semibold text-yellow-600">{{ assetPerbaikan }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 text-sm">Rusak</span>
              <span class="font-semibold text-red-600">{{ assetRusak }}</span>
            </div>

          </div>
        </div>
        </div>
    </div>

</template>