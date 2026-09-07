<script lang="ts" setup>
definePageMeta({
    layout: 'admin'
})

interface Location {
    id: number
    ruangan: string
    lantai: string
    gedung: string
    keterangan: string

}
interface ApiResponse {
    success: boolean
    message?: string
    data: Location[]
}

const { data: response } = await useFetch<ApiResponse>('/api/lokasi')
const locations = computed(() => response.value?.data || [])
</script>

<template>
    <div class="p-6">
        <h1 class="mb-6 text-2xl font-bold">
            Lokasi
        </h1>

        <table class="w-full border-collapse border">

            <thead>
                <tr class="bg-gray-100">

                    <th class="border p-3 text-left">
                        ID
                    </th>

                    <th class="border p-3 text-left">
                        Nama Lokasi
                    </th>
                    <th class="border p-3 text-left">
                        Lantai
                    </th>
                    <th class="border p-3 text-left">
                        Gedung
                    </th>

                    <th class="border p-3 text-left">
                        Keterangan
                    </th>

                </tr>
            </thead>

            <tbody>
                <tr v-for="item in locations" :key="item.id">

                    <td class="border p-3">{{ item.id }}</td>
                    <td class="border p-3">{{ item.ruangan }}</td>
                    <td class="border p-3">{{ item.lantai }}</td>
                    <td class="border p-3">{{ item.gedung }}</td>
                    <td class="border p-3">{{ item.keterangan }}</td>

                </tr>
            </tbody>

        </table>
    </div>
</template>