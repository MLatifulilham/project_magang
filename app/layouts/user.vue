<template>
  <div class="min-h-screen bg-gray-50">
    <UserSidebar />
    <div class="ml-[200px]">
      <UserTopbar />
      <main class="pt-[64px] p-6">
        <slot />
      </main>
    </div>
  </div>
</template>