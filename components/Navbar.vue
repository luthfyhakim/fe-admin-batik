<template>
    <nav class="fixed top-0 right-0 left-0 z-20 bg-neutral-800 text-white p-4 lg:ml-64">
      <div class="container mx-auto flex justify-between items-center">
        <!-- Toggle Button - Only visible on mobile -->
        <button 
          @click="$emit('toggle-sidebar')" 
          class="lg:hidden text-white hover:text-gray-300 focus:outline-none"
        >
          <span class="pi pi-bars text-2xl"></span>
        </button>
        
        <router-link 
          to="/about" 
          class="block px-4 py-2 rounded no-underline text-white hover:scale-110 transition"
        >
          {{ currentTime }}
        </router-link>
        
        <div class="space-x-4">
          <router-link 
            to="/profile" 
            class="text-2xl block px-4 py-2 rounded no-underline text-white hover:scale-110 transition"
          >
            <span class="pi pi-user-edit pe-4"></span>
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navbar',
    emits: ['toggle-sidebar'],
    data() {
      return {
        currentTime: this.getFormattedDateTime(),
      };
    },
    methods: {
      getFormattedDateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return now.toLocaleDateString(undefined, options);
      }
    },
    mounted() {
      // Update the date and time every second
      this.interval = setInterval(() => {
        this.currentTime = this.getFormattedDateTime();
      }, 1000);
    },
    beforeUnmount() {
      // Clear interval when component is destroyed
      clearInterval(this.interval);
    },
  };
  </script>
  
  <style scoped>
  /* Add any additional styling if necessary */
  </style>
  