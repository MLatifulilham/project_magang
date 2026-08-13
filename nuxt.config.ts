// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss', // utility-class CSS (nanti dipakai di semua halaman)
    '@pinia/nuxt',         // state management global (akan dipakai step berikutnya untuk simpan data user login)
  ],
  runtimeConfig: {
    public: {
      // process.env.NUXT_PUBLIC_API_BASE dibaca dari file .env
      // Kalau file .env belum ada / variabelnya belum diisi, dipakai
      // nilai default di belakang tanda "||" ini.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8080/api',
    },
  },
 
  // typescript.strict: mengaktifkan pengecekan tipe paling ketat.
  // Efeknya: TypeScript akan menegur kalau ada variabel yang tipenya
  // "kabur"/tidak jelas. Awalnya mungkin terasa cerewet, tapi ini yang
  // mencegah bug seperti "field undefined" muncul pas aplikasi jalan.
  typescript: {
    strict: true,
  },
})
