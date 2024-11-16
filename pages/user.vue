<!-- // user.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    <div :class="{ 'lg:block': true, 'hidden': !isSidebarOpen }">
      <Sidebar :class="{ 'show': isSidebarOpen }" />
    </div>

    <div class="lg:ml-64">
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="pt-20 min-h-screen">
        <div id="bg-2" class="p-4">
          <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4">Data user</h1>

          <!-- Search Bar -->
          <div class="mb-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by name or email..." 
              class="w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              @input="handleSearch"
            />
          </div>

          <!-- Success Modal -->
          <SuccessModal
            v-if="showSuccessModal"
            :message="successMessage"
            @close="showSuccessModal = false"
          />

          <!-- Add user Modal -->
          <Modal v-if="showAddModal" @close="showAddModal = false">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Add New user</h1>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="formData.nama" type="text" placeholder="Nama" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.email" type="email" placeholder="email@gmail.com" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.password" type="password" placeholder="Password" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.username" type="text" placeholder="username" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.alamat" type="text" placeholder="alamat" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.no_telp" type="number" placeholder="No Telpon" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input type="file" @change="handleFileChange" accept="image/*" class="p-2 text-white">
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" @click="showAddModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Submit</button>
              </div>
            </form>
          </Modal>

          <!-- Main Content -->
          <div class="block p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl text-white mt-8">
            <button @click="showAddModal = true" type="button" class="px-4 py-2 text-white rounded-lg transition mb-3" id="button-3">
              Add New user
            </button>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
                <thead class="bg-gray-700">
                  <tr>
                    <th class="py-2 px-4 text-left">No</th>
                    <th class="py-2 px-4 text-left">username</th>
                    <th class="py-2 px-4 text-left">Nama</th>
                    <th class="py-2 px-4 text-left">Email</th>
                    <th class="py-2 px-4 text-left">alamat</th>
                    <th class="py-2 px-4 text-left">No Telepon</th>
                    <th class="py-2 px-4 text-left">Foto</th>
                    <th class="py-2 px-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredusers" :key="item.id_user" class="border-b border-gray-600">
                    <td class="py-2 px-4">{{ index + 1 }}</td>
                    <td class="py-2 px-4">{{ item.username }}</td>
                    <td class="py-2 px-4">{{ item.nama }}</td>
                    <td class="py-2 px-4">{{ item.email }}</td>
                    <td class="py-2 px-4">{{ item.alamat }}</td>
                    <td class="py-2 px-4">{{ item.no_telp }}</td>
                    <td class="py-2 px-4">
                      <img 
                        v-if="item.foto" 
                        :src="`http://localhost:8080/images/users/${item.foto}`" 
                        alt="user photo" 
                        class="w-16 h-16 object-cover rounded-full"
                      >
                      <span v-else>No photo</span>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="handleDelete(item.id_user)" type="button" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Delete</button>
                    </td>
                  </tr>
                  <tr v-if="filteredusers.length === 0">
                    <td colspan="8" class="py-4 px-4 text-center text-gray-300">
                      No users found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import Navbar from '~/components/Navbar.vue';
import Modal from '~/components/Modal.vue';
import SuccessModal from '~/components/Successmodal.vue';

export default {
  components: {
    Sidebar,
    Navbar,
    Modal,
    SuccessModal
  },
  setup() {
    const searchQuery = ref('');
    const users = ref([]);
    const isSidebarOpen = ref(false);
    const showAddModal = ref(false);
    const showSuccessModal = ref(false);
    const successMessage = ref('');
    const selectedFile = ref(null);
    
    const formData = ref({
      nama: '',
      email: '',
      password: '',
      username: '',
      alamat: '',
      no_telp: '',
    });

    const filteredusers = computed(() => {
      if (!searchQuery.value) return users.value;
      
      const query = searchQuery.value.toLowerCase();
      return users.value.filter(user => 
        user.nama.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });

    const handleFileChange = (event) => {
      selectedFile.value = event.target.files[0];
    };

    const fetchusers = async () => {
      try {
        const response = await fetch('http://localhost:8080/user');
        const data = await response.json();
        users.value = data.result;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const handleSubmit = async () => {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData.value).forEach(key => {
          formDataToSend.append(key, formData.value[key]);
        });
        
        if (selectedFile.value) {
          formDataToSend.append('foto', selectedFile.value);
        }

        const response = await fetch('http://localhost:8080/user', {
          method: 'POST',
          body: formDataToSend
        });

        if (response.ok) {
          showAddModal.value = false;
          await fetchusers();
          // Reset form
          formData.value = {
            nama: '',
            email: '',
            password: '',
            username: '',
            alamat: '',
            no_telp: '',
          };
          selectedFile.value = null;
          // Show success message
          successMessage.value = 'Successfully Added New user';
          showSuccessModal.value = true;
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };

    const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          const response = await fetch(`http://localhost:8080/user/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchusers();
            successMessage.value = 'Successfully Deleted user';
            showSuccessModal.value = true;
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      }
    };

    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    onMounted(() => {
      fetchusers();
    });

    return {
      searchQuery,
      filteredusers,
      users,
      isSidebarOpen,
      showAddModal,
      showSuccessModal,
      successMessage,
      formData,
      toggleSidebar,
      handleSubmit,
      handleDelete,
      handleFileChange
    };
  }
};
</script>

<style scoped>
#bg-2 {
  background-color: #282828;
  background-size: cover;
  min-height: 89vh;
}

#button-1 {
  background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 255, 55, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.51);
  backdrop-filter: blur(24px);
}

#button-2 {
  background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(255, 0, 4, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.51);
  backdrop-filter: blur(24px);
}

#button-3 {
  background: linear-gradient(104deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 229, 255, 0.20) 68.64%), rgba(62, 62, 62, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.51);
  backdrop-filter: blur(24px);
}
</style>