<script lang="ts" setup>
definePageMeta({
  layout: 'admin'
})

interface Category {
  id: number
  nama_kategori: string
  keterangan: string
}

interface ApiResponse {
  success: boolean
  message?: string
  data: Category[]
}

const { data: response } = await useFetch<ApiResponse>('/api/aset-kategori')

const categories = computed(() => response.value?.data || [])

</script>
<template> 
<div class="p-6">
    <h1 class="mb-6 text-2xl font-bold">
      Kategori Aset
    </h1>

    <table class="w-full border-collapse border">

      <thead>
        <tr class="bg-gray-100">

          <th class="border p-3 text-left">
            Nama Kategori
          </th>
          <th class="border p-3 text-left">
            Keterangan
            </th>   
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in categories" :key="item.id">

          <td class="border p-3">{{ item.nama_kategori }}</td>
          <td class="border p-3">{{ item.keterangan }}</td>

        </tr>
      </tbody>

    </table>
  </div>
</template>