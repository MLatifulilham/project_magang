interface Percobaan {
  jumlah: number
  resetPada: number
}

const percobaanLogin = new Map<string, Percobaan>()

const batas_percobaan = 5
const jeda_waktu = 15 * 60 * 1000

export function cekPercobaanLogin(ip: string) {
  const sekarang = Date.now()
  const data = percobaanLogin.get(ip)

  if (!data || sekarang > data.resetPada) {
    return
  }

  if (data.jumlah >= batas_percobaan) {
    const sisaDetik = Math.ceil(
      (data.resetPada - sekarang) / 1000
    )

    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan login. Coba lagi dalam ${sisaDetik} detik.`,
    })
  }
}

export function catatLoginGagal(ip: string) {
  const sekarang = Date.now()
  const data = percobaanLogin.get(ip)

  if (!data || sekarang > data.resetPada) {
    percobaanLogin.set(ip, {
      jumlah: 1,
      resetPada: sekarang + jeda_waktu,
    })

    return
  }

  data.jumlah += 1
}