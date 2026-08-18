<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

interface LoginResponse {
  success: boolean
  message: string
  token: string
  data: {
    id: number
    nama: string
    email: string
    role: string
    departemen: string
    no_telepon: string
  }
}

const VALID_ROLES = ['admin', 'teknisi', 'staff']

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
    const token = useCookie('token', {maxAge: 60 * 60 * 3 })
    token.value = response.token
    const role = useCookie('role', {maxAge: 60 * 60 * 3} )
    role.value = response.data.role

 if (response.data.role === 'admin') {
      await navigateTo('/admin/dashboard')
    } else {
      // Semua role selain admin (di sini cuma 'staff') masuk ke
      // dashboard bersama di root, bukan folder per-role.
      await navigateTo('/dashboard')
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Email atau password salah'
  } finally {
    loading.value = false
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

        <!-- v-if: baris ini hanya muncul kalau errorMessage tidak kosong -->
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