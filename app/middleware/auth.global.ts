export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('token')
  const role = useCookie('role')

  // =========================
  // PROTEKSI HALAMAN LOGIN
  // =========================
  if (to.path === '/login' && token.value) {
    if (role.value === 'admin') {
      return navigateTo('/admin/dashboard')
    }

    return navigateTo('/dashboard')
  }

  // =========================
  // SEMUA /dashboard
  // =========================
  if (to.path.startsWith('/dashboard')) {
    if (!token.value) {
      return navigateTo('/login')
    }
  }

  // =========================
  // SEMUA /admin
  // =========================
  if (to.path.startsWith('/admin')) {
    // Belum login
    if (!token.value) {
      return navigateTo('/login')
    }

    // Bukan admin
    if (role.value !== 'admin') {
      return navigateTo('/dashboard')
    }
  }
})