<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition">
      <div class="p-6 w-full max-w-4xl mx-4 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl text-white transition">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Modal',
    emits: ['close']
  }
  </script>