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
            <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4" id="judul">Edit Your Profile</h1>
            <!-- Admin Profile Card -->
            <div id="card" class="p-10 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl h-max flex flex-col justify-center no-underline text-white transition">
              <div v-if="isLoading" class="flex justify-center items-center h-40">
                <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
  
              <div v-else-if="error" class="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200">
                {{ error }}
              </div>
  
              <div v-else>
                <div class="flex justify-between items-center mb-8">
                  <h1 class="text-3xl font-bold text-white">Admin Profile</h1>
                  <button 
                    @click="toggleEdit" 
                    class="px-4 py-2 text-white rounded-lg transition"
                    id="button-1"
                  >
                    {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                  </button>
                </div>
  
                <!-- View Mode -->
                <div v-if="!isEditing" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Name</label>
                        <p class="text-white text-lg font-medium">{{ adminData.nama }}</p>
                      </div>
                      
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Email</label>
                        <p class="text-white text-lg font-medium">{{ adminData.email }}</p>
                      </div>
                      
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Username</label>
                        <p class="text-white text-lg font-medium">{{ adminData.username }}</p>
                      </div>
                      
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Admin ID</label>
                        <p class="text-white text-lg font-medium">{{ adminData.id_admin }}</p>
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Edit Mode -->
                <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-4">
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Name</label>
                        <input 
                          v-model="editForm.nama" 
                          type="text" 
                          class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
  
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Email</label>
                        <input 
                          v-model="editForm.email" 
                          type="email" 
                          class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
  
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">Username</label>
                        <input 
                          v-model="editForm.username" 
                          type="text" 
                          class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
  
                      <div class="space-y-2">
                        <label class="text-white/60 text-sm">New Password (leave blank to keep current)</label>
                        <input 
                          v-model="editForm.password" 
                          type="password" 
                          class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
  
                  <div class="flex justify-end space-x-4">
                    <button 
                      type="button" 
                      @click="toggleEdit" 
                      class="px-4 py-2 text-white rounded-lg transition"
                      id="button-2"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      class="px-4 py-2 text-white rounded-lg transition"
                      id="button-3"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  definePageMeta({
    middleware: 'auth'
  });
  
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import md5 from 'md5';
  import Sidebar from '~/components/Sidebar.vue';
  import Navbar from '~/components/Navbar.vue';
  
  export default {
    components: {
      Sidebar,
      Navbar
    },
    setup() {
      const router = useRouter();
      const isSidebarOpen = ref(false);
      const adminData = ref(null);
      const isLoading = ref(true);
      const error = ref(null);
      const isEditing = ref(false);
      const editForm = ref({
        nama: '',
        email: '',
        username: '',
        password: ''
      });
  
      // Create axios instance
      const api = axios.create({
        baseURL: 'http://localhost:8080',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      const toggleEdit = () => {
        if (isEditing.value) {
          // Reset form when canceling
          editForm.value = {
            nama: adminData.value.nama,
            email: adminData.value.email,
            username: adminData.value.username,
            password: ''
          };
        } else {
          // Populate form with current data when starting to edit
          editForm.value = {
            nama: adminData.value.nama,
            email: adminData.value.email,
            username: adminData.value.username,
            password: ''
          };
        }
        isEditing.value = !isEditing.value;
      };
  
      const fetchAdminData = async () => {
        try {
          isLoading.value = true;
          error.value = null;
          
          const token = localStorage.getItem('adminToken');
          if (!token) {
            throw new Error('No authentication token found');
          }
  
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
          const response = await api.get('/admin');
          
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          
          adminData.value = response.data.result.find(
            admin => admin.id_admin === decodedToken.id_admin
          );
  
          if (!adminData.value) {
            throw new Error('Admin data not found');
          }
  
          // Initialize edit form with current data
          editForm.value = {
            nama: adminData.value.nama,
            email: adminData.value.email,
            username: adminData.value.username,
            password: ''
          };
  
        } catch (err) {
          console.error('Error fetching admin data:', err);
          error.value = 'Failed to load admin data. Please try logging in again.';
          
          if (err.response?.status === 401) {
            localStorage.removeItem('adminToken');
            router.push('/');
          }
        } finally {
          isLoading.value = false;
        }
      };
  
      const handleSubmit = async () => {
        try {
          isLoading.value = true;
          error.value = null;
  
          const token = localStorage.getItem('adminToken');
          const updateData = {
            nama: editForm.value.nama,
            email: editForm.value.email,
            username: editForm.value.username
          };
  
          // Only include password if it was changed
          if (editForm.value.password) {
            updateData.password = md5(editForm.value.password);
          }
  
          await api.patch(`/admin/${adminData.value.id_admin}`, updateData, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          // Refresh admin data after update
          await fetchAdminData();
          isEditing.value = false;
          alert('Profile updated successfully!');
  
        } catch (err) {
          console.error('Error updating profile:', err);
          error.value = 'Failed to update profile. Please try again.';
        } finally {
          isLoading.value = false;
        }
      };
  
      const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/');
      };
  
      onMounted(() => {
        fetchAdminData();
      });
  
      return {
        isSidebarOpen,
        toggleSidebar,
        adminData,
        isLoading,
        error,
        handleLogout,
        isEditing,
        editForm,
        toggleEdit,
        handleSubmit
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
  #button-1{
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 255, 55, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.51);
    backdrop-filter: blur(24px);
  }
  /* #butoon-1:hover{
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 255, 55, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  } */
  #button-2{
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 0, 4, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.51);
    backdrop-filter: blur(24px);
  }
  #button-3{
    background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 229, 255, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
    border: 1px solid rgba(255, 255, 255, 0.51);
    backdrop-filter: blur(24px);
  }
  #card {
    transition: all;
    background: linear-gradient(282deg, rgba(0, 0, 0, 0.00) 0%, rgba(170, 0, 255, 0.20) 79.66%), rgba(62, 62, 62, 0.37);
    }
  </style>