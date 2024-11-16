<!-- pages/login.vue -->
<template>
    <div class="min-h-screen w-full bg-gray-900 flex items-center justify-center relative overflow-hidden">
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
        <div class="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-xl border border-white/20">
          <h1 class="text-4xl font-bold text-white text-center mb-12">Login Admin</h1>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <label class="text-white text-lg">Email</label>
              <input 
                type="email" 
                v-model="email"
                :disabled="isLoading"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="email@gmail.com"
                required
              >
            </div>
  
            <div class="space-y-2">
              <label class="text-white text-lg">Password</label>
              <input 
                type="password" 
                v-model="password"
                :disabled="isLoading"
                class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Enter your password"
                required
              >
            </div>
  
            <div v-if="loginError" 
                 class="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm text-center">
              {{ loginError }}
            </div>
  
            <button 
              type="submit"
              class="w-full py-3 px-6 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading || !email || !password"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
              <span v-else>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: 'auth'
  })
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  import md5 from 'md5'
  
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const loginError = ref('')
  const isLoading = ref(false)
  
  const handleLogin = async () => {
    try {
      isLoading.value = true
      loginError.value = ''
  
      console.log('Attempting login with:', {
        email: email.value,
        passwordLength: password.value.length
      })
  
      const response = await axios.post('http://localhost:8080/admin/login', {
        email: email.value,
        password: password.value // md5 hashing is done on the server side
      })
  
      console.log('Login response:', response.data)
  
      // Store the token in localStorage
      localStorage.setItem('adminToken', response.data.token)
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
  
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error.response || error)
      loginError.value = error.response?.data?.message || 'Login failed. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
  </script>
  
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
    animation-delay: 4s;
  }
  </style>