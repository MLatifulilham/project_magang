<script setup lang="ts">

definePageMeta({
  layout: 'user'
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

interface ApiResponse {
  success: boolean
  message?: string
  data: Asset[]
}

const {
  data: response,
  pending,
  error,
  refresh
} = await useFetch<ApiResponse>('/api/assets')

const assets = computed(() =>
  response.value?.data || []
)

</script>

<template>

  <div>

    <h1 class="mb-6 text-2xl font-bold">
      Assets
    </h1>

    <table class="w-full border-collapse border">

      <thead>
        <tr class="bg-gray-100">

          <th class="border p-3 text-left">
            ID
          </th>

          <th class="border p-3 text-left">
            Nama Asset
          </th>

          <th class="border p-3 text-left">
            Category ID
          </th>

          <th class="border p-3 text-left">
            Location ID
          </th>

          <th class="border p-3 text-left">
            Brand
          </th>

          <th class="border p-3 text-left">
            Model
          </th>

          <th class="border p-3 text-left">
            Nomor Serial
          </th>

          <th class="border p-3 text-left">
            Status
          </th>

        </tr>
      </thead>

      <tbody>

        <tr
          v-for="asset in assets"
          :key="asset.id"
          class="hover:bg-gray-50"
        >

          <td class="border p-3"> {{ asset.id }}</td>

          <td class="border p-3">
            {{ asset.nama }}
          </td>

          <td class="border p-3">
            {{ asset.category_id }}
          </td>

          <td class="border p-3">
            {{ asset.location_id }}
          </td>

          <td class="border p-3">
            {{ asset.brand }}
          </td>

          <td class="border p-3">
            {{ asset.model }}
          </td>

          <td class="border p-3">
            {{ asset.no_serial }}
          </td>

          <td class="border p-3">
            {{ asset.status }}
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</template>