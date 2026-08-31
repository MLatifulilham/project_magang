<script setup lang="ts">
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

const {
  data: response,
} = await useFetch<ApiResponse>('/api/locations')

const locations = computed(() => response.value?.data || [])

const logout = async () => {
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })

    await navigateTo('/login')
  } catch (error) {
    console.error('Logout gagal:', error)
  }
}
</script>

<template>

  <div class="mb-4 flex justify-end">
    <button
      @click="logout"
      class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      Logout
    </button>
  </div>
 <th > dashboard staff</th>
  <table class="w-full border-collapse border">
    <thead>
      <tr class="bg-gray-100">
        <th class="border p-3 text-left">IDe</th>
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

</template>