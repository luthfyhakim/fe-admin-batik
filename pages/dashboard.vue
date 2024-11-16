<template>
    <div class="min-h-screen bg-gray-100">
      <!-- Sidebar with mobile responsiveness -->
      <div :class="{ 'lg:block': true, 'hidden': !isSidebarOpen }">
        <Sidebar :class="{ 'show': isSidebarOpen }" />
      </div>
      
      <!-- Main content wrapper -->
      <div class="lg:ml-64">
        <!-- Navbar -->
        <Navbar @toggle-sidebar="toggleSidebar" />
  
        <!-- Main Content -->
        <main class="pt-20 min-h-screen">
          <div id="bg-2" class="p-4">
            <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4" id="judul">Admin Dasboard</h1>
            <div class="flex flex-col justify-center">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <a id="card-1" class="block max-w-sm p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl h-max flex flex-col justify-center no-underline text-white hover:scale-105 transition">
                    <div class="flex justify-center items-center">
                      <i class="pi pi-face-smile" style="font-size: 4rem"></i>
                    </div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-center pt-5">Total Produk</h5>
                    <p class="font-normal text-center text-xl">50</p>
                  </a>
                </div>
                <div>
                  <a id="card-2" class="block max-w-sm p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl h-max flex flex-col justify-center no-underline text-white hover:scale-105 transition">
                    <div class="flex justify-center items-center">
                      <i class="pi pi-user" style="font-size: 4rem"></i>
                    </div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-center pt-5">Total User</h5>
                    <p class="font-normal text-center text-xl">40</p>
                  </a>
                </div>
                <div>
                  <a id="card-3" class="block max-w-sm p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl h-max flex flex-col justify-center no-underline text-white hover:scale-105 transition">
                    <div class="flex justify-center items-center">
                      <i class="pi pi-face-smile" style="font-size: 4rem"></i>
                    </div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-center pt-5">Total Transaksi</h5>
                    <p class="font-normal text-center text-xl">12</p>
                  </a>
                </div>
                <div>
                  <a id="card-4" class="block max-w-sm p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl h-max flex flex-col justify-center no-underline text-white hover:scale-105 transition">
                    <div class="flex justify-center items-center">
                      <i class="pi pi-face-smile" style="font-size: 4rem"></i>
                    </div>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-center pt-5">Total Daerah</h5>
                    <p class="font-normal text-center text-xl">5</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
// untuk autentikasi
definePageMeta({
  middleware: 'auth'
});

  import { ref } from 'vue';
  import Sidebar from '~/components/Sidebar.vue';
  import Navbar from '~/components/Navbar.vue';
  
  export default {
    components: {
      Sidebar,
      Navbar
    },
    setup() {
      const isSidebarOpen = ref(false);
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      return {
        isSidebarOpen,
        toggleSidebar
      };
    }
  };
  </script>
  
  <style>
  #bg-2 {
    background-color: #282828;
    background-size: cover;
    min-height: 89vh;
  }
  
  #card-1:hover {
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 71, 255, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  }
  
  #card-2:hover {
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(170, 0, 255, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  }
  
  #card-3:hover {
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 0, 183, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  }
  
  #card-4:hover {
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 234, 255, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  }
  </style>
  