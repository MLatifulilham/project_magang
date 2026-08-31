import { verifyToken } from '../utils/jwt'

// Route yang BOLEH diakses TANPA token. Tambahkan ke daftar ini kalau
// nanti ada endpoint publik baru (misal /api/auth/register).
const publicPaths = ['/api/auth/login']

export default defineEventHandler((event) => {
  // Middleware ini jalan untuk SEMUA request, termasuk yang bukan API
  // (misal request ke halaman .vue). Baris ini membatasi middleware
  // cuma aktif buat request ke /api/, biarkan yang lain lewat.
  if (!event.path.startsWith('/api/')) return

  // Endpoint yang memang sengaja publik (login) dilewatkan begitu saja.
  const isPublic = publicPaths.some((path) => event.path.startsWith(path))
  if (isPublic) return

  // -----------------------------------------------------------------
  // Dari sini ke bawah: SEMUA endpoint /api/ lainnya WAJIB kirim token,
  // baik lewat header Authorization ATAU cookie 'token'.
  // -----------------------------------------------------------------
  const authHeader = getHeader(event, 'authorization')
  const tokenFromHeader = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null

  const tokenFromCookie = getCookie(event, 'token')
  const token = tokenFromHeader || tokenFromCookie

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token tidak ditemukan',
    })
  }

  // verifyToken() otomatis throw kalau expired/rusak/invalid -
  // request langsung berhenti di sini, tidak pernah sampai ke handler.
  const payload = verifyToken(token)

  // Simpan hasil decode ke event.context - ini yang bikin endpoint
  // TIDAK PERLU manggil verifyToken/requireAuth lagi. Cukup baca
  // event.context.user langsung kalau butuh tau siapa yang login
  // (contoh dipakai di tickets/index.post.ts untuk pelapor_id).
  event.context.user = payload
})