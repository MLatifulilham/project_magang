export default defineNuxtRouteMiddleware(async (to) => {
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
    session = null
  }
  const isLogin = session?.success === true
  const role = session?.data?.role

  if (to.path === '/login') {
    if (!isLogin) {
      return
    }

    if (role === 'admin') {
      return navigateTo('/admin/dashboard')
    }

    if (role === 'staff') {
      return navigateTo('/user/dashboard')
    }

    return navigateTo('/login')
  }

  if (!isLogin) {
    return navigateTo('/login')
  }

  if (to.path === '/') {
    if (role === 'admin') {
      return navigateTo('/admin/dashboard')
    }

    if (role === 'staff') {
      return navigateTo('/user/dashboard')
    }

    return navigateTo('/login')
  }

  if (to.path === '/admin' || to.path.startsWith('/admin/')) {
    if (role !== 'admin') {
      return navigateTo('/user/dashboard')
    }

    return
  }

  if (to.path === '/user' || to.path.startsWith('/user/')) {
    if (role !== 'staff') {
      return navigateTo('/admin/dashboard')
    }

    return
  }
})