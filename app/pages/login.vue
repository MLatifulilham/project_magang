<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

interface LoginResponse {
  success: boolean
  message: string
  data: {
    id: number
    nama: string
    email: string
    role: string
    departemen: string
    no_telepon: string
  }
}

const VALID_ROLES = ['admin','staff', 'teknisi']

const login = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })

    if (!VALID_ROLES.includes(response.data.role)) {
      errorMessage.value = 'Role pengguna tidak dikenali'
      return
    }
 if (response.data.role === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      await navigateTo('/user/dashboard')
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Email atau password salah'
  } finally {
    loading.value = false
  }
  const logout = async () => {
  await $fetch('/api/auth/logout', {
    method: 'POST'
  })

  await navigateTo('/')
}
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Masukkan email"
            class="w-full border rounded-lg px-4 py-3"
          >
        </div>

        <div class="mb-4">
          <label class="block mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Masukkan password"
            class="w-full border rounded-lg px-4 py-3"
          >
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white rounded-lg px-4 py-3 disabled:opacity-50"
        >
          {{ loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>