<template>
    <div class="min-h-screen w-full bg-neutral-200 flex items-center justify-center relative overflow-hidden">
      <!-- Gradient Blobs -->
      <div class="absolute top-0 left-0 w-[500px] h-[500px] blur-3xl opacity-50">
        <div class="w-full h-full rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 animate-blob"></div>
      </div>
      
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] blur-3xl opacity-50">
        <div class="w-full h-full rounded-full bg-gradient-to-bl from-blue-400 via-purple-400 to-pink-400 animate-blob animation-delay-2000"></div>
      </div>
      
      <div class="absolute bottom-0 left-0 w-[500px] h-[500px] blur-3xl opacity-50">
        <div class="w-full h-full rounded-full bg-gradient-to-tr from-green-400 via-purple-400 to-pink-400 animate-blob animation-delay-4000"></div>
      </div>
  
      <!-- Login Card -->
      <div class="relative z-10 w-full max-w-md p-8 mx-4">
        <div class="backdrop-blur-xl bg-zinc/20 rounded-3xl p-8 shadow-xl border border-black/20">
          <h1 class="text-4xl font-bold text-neutral-600 text-center mb-12">Hello Admin</h1>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <label class="text-neutral-600 text-lg">email</label>
              <input 
                type="email" 
                v-model="email"
                class="w-full px-4 py-3 rounded-lg bg-black/10 border border-black/20 text-neutral-600 placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="email@gmail.com"
              >
            </div>
  
            <div class="space-y-2">
              <label class="text-neutral-600 text-lg">password</label>
              <input 
                type="password" 
                v-model="password"
                class="w-full px-4 py-3 rounded-lg bg-black/10 border border-black/20 text-neutral-600 placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Enter your password"
              >
            </div>
  
            <button 
              type="submit"
              class="w-full py-3 px-6 rounded-lg bg-black/10 hover:bg-black/20 border border-black/20 text-neutral-600 font-semibold transition duration-200 backdrop-blur-sm"
            >
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <!-- <script setup>
  const email = ref('')
  const password = ref('')
  
  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempt:', { email: email.value, password: password.value })
  }
  </script> -->
  
  <style>
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 2s;
  }
  </style>