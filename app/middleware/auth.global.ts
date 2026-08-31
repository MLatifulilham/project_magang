export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login') {
    return
  }

  const requestFetch = useRequestFetch()

  let session

  try {
    session = await requestFetch<{
      success: boolean
      data: {
        id: number
        email: string
        role: string
      }
    }>('/api/auth/cek-sesi')
  } catch {
    return navigateTo('/login')
  }

  if (!session?.success) {
    return navigateTo('/login')
  }

  const role = session.data.role

  if (to.path === '/') {
    if (role === 'admin') {
      return navigateTo('/admin/dashboard')
    }

    if (role === 'staff' || role === 'teknisi') {
      return navigateTo('/dashboard')
    }

    return navigateTo('/login')
  }

  if (to.path.startsWith('/admin')) {
    if (role !== 'admin') {
      return navigateTo('/dashboard')
    }
  }

  if (to.path === '/dashboard' || to.path.startsWith('/dashboard/')) {
    if (role === 'admin') {
      return navigateTo('/admin/dashboard')
    }

    if (role !== 'staff' && role !== 'teknisi') {
      return navigateTo('/login')
    }
  }
})