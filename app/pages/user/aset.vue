<script setup lang="ts">
definePageMeta({ layout: 'user' })

interface assets {
    lantai: string
    gedung: string
    ruangan: string
    file_path: string
    status: string
    nama: string
    no_serial: string
    nama_kategori: string
}

interface AssetResponse {
    success: boolean
    messsage?: string
    data: assets[]
}

const { data: assetResponse, } = await useFetch<AssetResponse>('/api/assets')
const assets = computed(() =>
    assetResponse.value?.data || []
)

const assetNonaktif = computed(() =>
    assets.value.filter(asset => asset.status === 'nonaktif').length)
const totalAset = computed(() => assets.value.length)
const assetRusak = computed(() =>
    assets.value.filter(asset => asset.status === 'rusak').length)
const assetAktif = computed(() =>
    assets.value.filter(asset => asset.status === 'aktif').length)
const assetPerbaikan = computed(() =>
    assets.value.filter(asset => asset.status === 'perbaikan').length)


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
        <div>
            <h1 class="mb-6 text-2xl font-bold">aset</h1>
        </div>
        <div class="grid grid-cols-5 gap-3 mb-4">
            <div class="border border-gray-300 bg-white p-5 h-27">
                <p class="text-sm text-gray-600 font-bold">aset yang di perbaiki</p>
                <p class="text-2xl font-bold mt-2">{{ assetPerbaikan }}</p>

            </div>
            <div class="border border-gray-300 p-5 h-27">
                <p class="font-bold texxt-2xl text-sm">sktif</p>
                <p>{{ assetAktif }}</p>

            </div>
            <div class="border border-gray-300 p-5 h-27">
                <p>Rusak</p>
                <p>{{ assetRusak }}</p>
            </div>
            <div class="border border-gray-300 p-5 h-27">
                <p>Nonaktif</p>
                <p>{{ assetNonaktif }}</p>
            </div>
            <div class="border border-gray-300 p-5 h-27">
                <p>total aset</p>
                <p>{{ totalAset }}</p>
            </div>
        </div>
        <div class="border border-gray-300 bg-white">
            <div class="flext items-center justify-end gap-2 p-3">
                <div class="relative">
                    <input v-model="search" type="text" placeholder="Search"
                    class="w-48 border border-gray-300 rounded px-3 py-2 text-sm" 
                </div>

                <select v -model="filterStatus border-gray-300 rounded px-3 py-2 text-sm">
                    <option value="">
                        filter
                    </option>
                    <option value="aktif">aktif</option>
                    <option value="perbaikan">perbaikan</option>
                    <option value="rusak">rusak</option>
                    <option value="nonaktif">nonaktif</option>
                </select>
                <button type="button" @click="navigateTo('/user/tambah-aset/tambah-aset')"
                    class="flex h-9 w-9 items-center justify-center rounded-full text-2xl font-bold hover:bg-gray-100">
                    +</button> 
            
            </div>

            <div></div>

        </div>

    </div>
</template>