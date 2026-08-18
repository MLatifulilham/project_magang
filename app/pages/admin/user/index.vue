<script setup lang="ts">
interface User {
  id: number
  nama: string
  email: string
}

interface ApiResponse {
  success: boolean
  data: User[]
}

const { data: response, pending, error, refresh } = await useFetch<ApiResponse>(
  '/api/user'
)

const users = computed(() => response.value?.data || [])
</script>

<template>

    <!-- Tabel -->
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-3 text-left">ID</th>
          <th class="border p-3 text-left">Nama</th>
          <th class="border p-3 text-left">Email</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
        >
          <td class="border p-3">
            {{ user.id }}
          </td>

          <td class="border p-3">
            {{ user.nama }}
          </td>

          <td class="border p-3">
            {{ user.email }}
          </td>
        </tr>
      </tbody>
    </table>
</template>