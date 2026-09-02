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

  <aside class="fixed left-0 top-0 bottom-0 w-[200px]
           bg-[#c8d8ee]
           flex flex-col justify-between
           overflow-hidden">

    <div class="flex-1 overflow-y-auto p-3 space-y-1">

      
      <NuxtLink to="/admin/dashboard" class="block px-10 py-3 rounded-lg hover:bg-white/50">
        Dashboard
      </NuxtLink>

      <NuxtLink to="/assets" class="block px-10 py-3 rounded-lg hover:bg-white/50">
        Assets
      </NuxtLink>

      <NuxtLink to="/admin/part" class="block px-10 py-3 rounded-lg hover:bg-white/50">
        Part
      </NuxtLink>

    </div>


    <div class="p-3">

      <button @click="logout" class="w-full rounded-lg bg-red-500
               px-3 py-2 text-white
               hover:bg-red-600">
        Logout
      </button>

    </div>

  </aside>


  <main class="ml-[200px] p-6">


    <table class="w-full border-collapse border">

      <thead>

        <tr class="bg-gray-100">

          <th class="border p-3 text-left">
            ID
          </th>

          <th class="border p-3 text-left">
            Gedung
          </th>

          <th class="border p-3 text-left">
            Lantai
          </th>

          <th class="border p-3 text-left">
            Ruangan
          </th>

          <th class="border p-3 text-left">
            Keterangan
          </th>

        </tr>

      </thead>


      <tbody>

        <tr v-for="location in locations" :key="location.id">

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

  </main>

</template> 