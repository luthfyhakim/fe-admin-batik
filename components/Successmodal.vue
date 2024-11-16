<!-- components/SuccessModal.vue -->
<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50"></div>
      <div class="relative p-6 max-w-md w-full mx-4 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl text-white transition">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-4">{{ message }}</h3>
          <button
            @click="$emit('close')"
             class="px-4 py-2 text-white rounded-lg transition" id="button-1">Okay</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: {
        type: String,
        required: true
      }
    }
  }
  </script>

  <style>
#button-1 {
  background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 255, 55, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.51);
  backdrop-filter: blur(24px);
}
</style>