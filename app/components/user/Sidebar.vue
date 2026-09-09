<script setup lang="ts">

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

      <div class="px-6 py-4 text-xl font-bold">
        SIMPERA
      </div>

      <NuxtLink to="/user/dashboard" class="block px-10 py-3 rounded-lg hover:bg-white/50"
        active-class="bg-white font-semibold">
        Dashboard
      </NuxtLink>

      <NuxtLink to="/user/aset" class="block px-10 py-3 rounded-lg hover:bg-white/50"
        active-class="bg-white font-semibold">
        Aset kantor
      </NuxtLink>

      <NuxtLink to="/user/spare-part" class="block px-10 py-3 rounded-lg hover:bg-white/50"
        active-class="bg-white font-semibold">
        Spare part
      </NuxtLink>


      <NuxtLink to="/user/peminjaman-aset" class="block px-10 py-3 rounded-lg hover:bg-white/50"
        active-class="bg-white font-semibold">
        Peminjaman Aset
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

</template>