export default defineEventHandler(async (event) => {
  deleteCookie(event, 'token', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  })

  return {
    success: true,
    message: 'Logout berhasil'
  }
})