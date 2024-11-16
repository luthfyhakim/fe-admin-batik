<!-- Sidebar.vue -->
<template>
  <aside class="fixed top-0 left-0 z-30 w-64 bg-neutral-800 text-white h-screen overflow-y-auto" :class="{ 'show': isOpen }">
    <div class="p-4">
      <ul class="space-y-4">
        <div class="mb-8">
          <NuxtLink to="/dashboard" class="text-xl font-semibold no-underline text-white transition">batikIndonesia Admin</NuxtLink>
        </div>
        <li>
          <NuxtLink to="/dashboard" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-home pe-4"></span>Dashboard
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/produk" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-inbox pe-4"></span>Produk
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/daerah" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-face-smile pe-4"></span>Daerah
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/kategori" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-face-smile pe-4"></span>Kategori
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/transaksi" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-shopping-cart pe-4"></span>Transaksi
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/user" class="block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition">
            <span class="pi pi-user pe-4"></span>User
          </NuxtLink>
        </li>
        <li>
          <button @click="handleLogout" class="w-full block px-4 py-2 rounded no-underline text-white hover:bg-neutral-700 hover:scale-110 transition text-left">
            <span class="pi pi-sign-out pe-4"></span>Logout
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const handleLogout = () => {
  // Clear token from localStorage
  localStorage.removeItem('adminToken')
  
  // Remove Authorization header
  delete axios.defaults.headers.common['Authorization']
  
  // Redirect to login page
  router.push('/')
}
</script>

<style scoped>
aside {
  transition: transform 0.3s ease-in-out;
}

@media (max-width: 1024px) {
  aside {
      transform: translateX(-100%);
  }
  
  aside.show {
      transform: translateX(0);
  }
}
</style>