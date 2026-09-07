<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const form = ref({
  kode_aset: '',
  nama: '',
  category_id: '',
  location_id: '',
  brand: '',
  model: '',
  no_serial: '',
  spesifikasi: '',
  status: 'aktif',
  penanggung_jawab_id: '',
  tgl_perolehan: '',
  harga_perolehan: '',
  garansi_sampai: '',
  qr_code: '',
  catatan: '',
})

const foto = ref<File | null>(null)
const preview = ref<string | null>(null)
const loading = ref(false)

const pilihFoto = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  foto.value = input.files[0]
  preview.value = URL.createObjectURL(input.files[0])
}

const tambahAsset = async () => {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('kode_aset', form.value.kode_aset)
    formData.append('nama', form.value.nama)
    formData.append('category_id', form.value.category_id)
    formData.append('location_id', form.value.location_id)
    formData.append('brand', form.value.brand)
    formData.append('model', form.value.model)
    formData.append('no_serial', form.value.no_serial)
    formData.append('spesifikasi', form.value.spesifikasi)
    formData.append('status', form.value.status)
    formData.append('penanggung_jawab_id', form.value.penanggung_jawab_id)
    formData.append('tgl_perolehan', form.value.tgl_perolehan)
    formData.append('harga_perolehan', form.value.harga_perolehan)
    formData.append('garansi_sampai', form.value.garansi_sampai)
    formData.append('qr_code', form.value.qr_code)
    formData.append('catatan', form.value.catatan)

    if (foto.value) {
      formData.append('foto', foto.value)
    }

    await $fetch('/api/assets', { method: 'POST', body: formData })

    alert('Asset berhasil ditambahkan')
    await navigateTo('/admin/assets')
  } catch (error: any) {
    alert(error?.data?.statusMessage || 'Gagal menambahkan asset')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Tambah Asset</h1>
      <p class="text-gray-500">Masukkan data asset dan foto asset</p>
    </div>

    <form @submit.prevent="tambahAsset" class="space-y-6">
      <div class="rounded-lg border bg-white border-gray-400 p-5">
        <h2 class="mb-4 font-semibold">Foto Asset</h2>
        <div class="flex items-center gap-5">
          <div class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-gray-400 bg-gray-100">
            <img v-if="preview" :src="preview" class="h-full w-full object-cover" />
            <span v-else class="text-sm text-gray-400">Belum ada foto</span>
          </div>
          <div>
            <input type="file" accept="image/*" @change="pilihFoto" class="block" />
            <p class="mt-2 text-sm text-gray-500">JPG, PNG, WEBP</p>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-gray-400 bg-white p-5">
        <h2 class="mb-5 font-semibold">Data Asset</h2>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium">Kode Asset</label>
            <input v-model="form.kode_aset" type="text" required class="w-full rounded-lg border border-gray-400 px-3 py-2" placeholder="AST-001" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Nama Asset</label>
            <input v-model="form.nama" type="text" required class="w-full rounded-lg border border-gray-400 px-3 py-2" placeholder="Laptop Lenovo" />
          </div>

          <!-- DIAKTIFKAN KEMBALI: backend WAJIB kolom ini, tanpa input
               ini form akan SELALU gagal dengan pesan "wajib diisi" -->
          <div>
            <label class="mb-1 block text-sm font-medium">Category ID</label>
            <input v-model="form.category_id" type="number" required class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Location ID</label>
            <input v-model="form.location_id" type="number" required class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Brand</label>
            <input v-model="form.brand" type="text" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Model</label>
            <input v-model="form.model" type="text" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <!-- DIAKTIFKAN KEMBALI: backend WAJIB kolom ini + dicek harus
               unik (tidak boleh sama dengan aset lain) -->
          <div>
            <label class="mb-1 block text-sm font-medium">No Serial</label>
            <input v-model="form.no_serial" type="text" required class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Status</label>
            <select v-model="form.status" class="w-full rounded-lg border border-gray-400 px-3 py-2">
              <option value="aktif">Aktif</option>
              <option value="rusak">Rusak</option>
              <option value="perbaikan">Perbaikan</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Tanggal Perolehan</label>
            <input v-model="form.tgl_perolehan" type="date" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Harga Perolehan</label>
            <input v-model="form.harga_perolehan" type="number" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Garansi Sampai</label>
            <input v-model="form.garansi_sampai" type="date" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Penanggung Jawab ID</label>
            <input v-model="form.penanggung_jawab_id" type="number" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
          </div>
        </div>

        <div class="mt-5">
          <label class="mb-1 block text-sm font-medium">Spesifikasi</label>
          <textarea v-model="form.spesifikasi" rows="4" class="w-full rounded-lg border border-gray-400 px-3 py-2" placeholder="Intel Core i5, RAM 16GB, SSD 512GB..." />
        </div>

        <div class="mt-5">
          <label class="mb-1 block text-sm font-medium">QR Code</label>
          <input v-model="form.qr_code" type="text" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
        </div>

        <div class="mt-5">
          <label class="mb-1 block text-sm font-medium">Catatan</label>
          <textarea v-model="form.catatan" rows="3" class="w-full rounded-lg border border-gray-400 px-3 py-2" />
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button type="button" @click="navigateTo('/admin/detail-aset/aset-detail')" class="rounded-lg border border-gray-400 px-5 py-2">
          Batal
        </button>
        <button type="submit" :disabled="loading" class="rounded-lg bg-blue-700 px-5 py-2 text-white disabled:opacity-50">
          {{ loading ? 'Menyimpan...' : 'Simpan Asset' }}
        </button>
      </div>
    </form>
  </div>
</template>