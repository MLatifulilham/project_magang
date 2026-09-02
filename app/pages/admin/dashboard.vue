<script setup lang="ts">

definePageMeta({
  layout: 'admin'
})

interface Location {
  id: number
  gedung: string
  lantai: string
  ruangan: string
  keterangan: string
}

interface ApiResponse {
  success: boolean
  data: Location[]
}

const { data: response } =
  await useFetch<ApiResponse>('/api/locations')

const locations = computed(() =>
  response.value?.data || []
)

</script>

<template>

  <div>

    <h1 class="mb-6 text-2xl font-bold">
      Dashboard Admin
    </h1>

    <table class="w-full border-collapse border">

      <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">ID</th>
          <th class="border p-3 text-left">Gedung</th>
          <th class="border p-3 text-left">Lantai</th>
          <th class="border p-3 text-left">Ruangan</th>
          <th class="border p-3 text-left">Keterangan</th>
        </tr>
      </thead>

      <tbody>

        <tr
          v-for="location in locations"
          :key="location.id"
        >
          <td class="border p-3">
            {{ location.id }}
          </td>

          <td class="border p-3">
            {{ location.gedung }}
          </td>

          <td class="border p-3">
            {{ location.lantai }}
          </td>

          <td class="border p-3">
            {{ location.ruangan }}
          </td>

          <td class="border p-3">
            {{ location.keterangan }}
          </td>
        </tr>

      </tbody>

    </table>

  </div>

</template>