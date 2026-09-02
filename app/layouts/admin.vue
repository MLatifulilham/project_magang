<template>

  <div class="min-h-screen bg-gray-50">

    <AdminSidebar />

    <div class="ml-[200px]">

      <AdminTopbar />

      <main class="pt-[64px] p-6">
        <slot />
      </main>

    </div>

  </div>

</template>