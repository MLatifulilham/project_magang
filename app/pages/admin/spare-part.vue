<script lang="ts" setup>
definePageMeta({
    layout: 'admin'
})

interface SparePart {
    id: number
    nama: string
    satuan: string
    stok: string
    harga_satuan: number
}

interface SparePartResponse {
    success: boolean
    message?: string
    data: SparePart[]
}

const {
    data: sparePartResponse,
} = await useFetch<SparePartResponse>('/api/spare_parts')

const spareParts = computed(() => sparePartResponse.value?.data || [])

</script>
<template>
    <div>
        <h1 class="mb-6 text-2xl font-bold">
            Spare Parts
        </h1>

        <table class="w-full border-collapse border">

            <thead>
                <tr class="bg-gray-100">

                    <th class="border p-3 text-left">
                        Spare part
                    </th>

                    <th class="border p-3 text-left">
                        Nama
                    </th>

                    <th class="border p-3 text-left">
                        Stok
                    </th>

                    <th class="border p-3 text-left">
                        Satuan
                    </th>
                        

                    <th class="border p-3 text-left">
                        Harga Satuan
                    </th>


                </tr>
            </thead>

            <tbody>
                <tr v-for="item in spareParts" :key="item.id">

                    <td class="border p-3">{{ item.id }}</td>
                    <td class="border p-3">{{ item.nama }}</td>
                    <td class="border p-3">{{ item.stok }}</td>
                    <td class="border p-3">{{ item.satuan }}</td>
                    <td class="border p-3">{{ item.harga_satuan }}</td>

                </tr>
            </tbody>
        </table>
    </div>

</template>