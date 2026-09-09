<template>
    <header class="fixed top-0 left-[200px] right-0 z-40
           h-[64px]
           bg-white
           border-b border-gray-200
           flex items-center justify-between
           px-6">
        <div class="flex items-center gap-6">

            <!-- <button class="text-xl text-gray-600 hover:text-gray-900">
                ☰
            </button> -->

            <span class="text-lg font-semibold text-gray-700">
                DASHBOARD ADMIN
            </span>

        </div>

        <section @click="navigateTo('/user/notifikasi')" class="cursor-pointer overflow-hidden">
            <div class="flex items-center gap-4">
                <button type="button">
                    Notifikasi
                </button>

                <button type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white">
                    I
                </button>
            </div>
        </section>
    </header>

</template>