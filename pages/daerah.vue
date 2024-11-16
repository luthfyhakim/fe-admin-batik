<template>
    <div class="min-h-screen bg-gray-100">
      <div :class="{ 'lg:block': true, 'hidden': !isSidebarOpen }">
        <Sidebar :class="{ 'show': isSidebarOpen }" />
      </div>
  
      <div class="lg:ml-64">
        <Navbar @toggle-sidebar="toggleSidebar" />
  
        <main class="pt-20 min-h-screen">
          <div id="bg-2" class="p-4">
            <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4">Data daerah</h1>
  
            <!-- Search Bar -->
            <div class="mb-4">
            <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search by nama daerah..." 
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
  
            <!-- Add New daerah Modal -->
            <Modal v-if="showAddModal" @close="showAddModal = false">
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Add New Data Daerah</h1>
                <div class="grid grid-cols-1 gap-4">
                  <input v-model="formData.nama_daerah" type="text" placeholder="Nama daerah" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="showAddModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                  <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Submit</button>
                </div>
              </form>
            </Modal>
  
            <!-- Edit daerah Modal -->
            <Modal v-if="showEditModal" @close="showEditModal = false">
              <form @submit.prevent="handleEdit" class="space-y-4">
                <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Edit Data daerah</h1>
                <div class="grid grid-cols-1 gap-4">
                  <input v-model="editData.nama_daerah" type="text" placeholder="Nama daerah" class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="showEditModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                  <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Update</button>
                </div>
              </form>
            </Modal>
  
            <!-- Main Content -->
            <div class="block p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl text-white mt-8">
              <button @click="showAddModal = true" type="button" class="px-4 py-2 text-white rounded-lg transition mb-3" id="button-3">
                Add New Data
              </button>
  
              <!-- Table -->
                <div class="overflow-x-auto">
                <table class="min-w-full bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
                    <thead class="bg-gray-700">
                    <tr>
                        <th class="py-2 px-4 text-left">No</th>
                        <th class="py-2 px-4 text-left">Nama daerah</th>
                        <th class="py-2 px-4 text-left">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in filtereddaerahs" :key="item.id_daerah" class="border-b border-gray-600">
                        <td class="py-2 px-4">{{ index + 1 }}</td>
                        <td class="py-2 px-4">{{ item.nama_daerah }}</td>
                        <td class="py-2 px-4">
                        <button @click="openEditModal(item)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-1">Edit</button>
                        <button @click="handleDelete(item.id_daerah)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-2">Delete</button>
                        </td>
                    </tr>
                    <!-- No Results Message -->
                    <tr v-if="filtereddaerahs.length === 0">
                        <td colspan="5" class="py-4 px-4 text-center text-gray-300">
                        No matching products found
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
  import { ref, onMounted } from 'vue';
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
      const daerahs = ref([]);
      const isSidebarOpen = ref(false);
      const showAddModal = ref(false);
      const showEditModal = ref(false);
      const showSuccessModal = ref(false);
      const successMessage = ref('');
      
// Computed property for filtered products
    const filtereddaerahs = computed(() => {
      if (!searchQuery.value) return daerahs.value;
      
      const query = searchQuery.value.toLowerCase();
      return daerahs.value.filter(product => 
        product.nama_daerah.toLowerCase().includes(query)
      );
    });

    // Debounce function
    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
      };
    };

    // Search handler with debounce
    const handleSearch = debounce(() => {
      // The filtering is handled by the computed property
      // This function can be used for additional search-related logic if needed
    }, 300);
      
      const formData = ref({
        nama_daerah: '',
      });
  
      const editData = ref({
        id_daerah: null,
        nama_daerah: '',
      });
  
      const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(price);
      };
  
      const fetchdaerahs = async () => {
        try {
          const response = await fetch('http://localhost:8080/daerah');
          const data = await response.json();
          daerahs.value = data.result;
        } catch (error) {
          console.error('Error fetching daerahs:', error);
        }
      };
  
      const handleSubmit = async () => {
        try {
          const response = await fetch('http://localhost:8080/daerah', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData.value)
          });
  
          if (response.ok) {
            showAddModal.value = false;
            await fetchdaerahs();
            // Reset form
            formData.value = {
              nama_daerah: '',
            };
            // Show success message
            successMessage.value = 'Successfully Added New Data';
            showSuccessModal.value = true;
          }
        } catch (error) {
          console.error('Error adding daerah:', error);
        }
      };
  
      const openEditModal = (daerah) => {
        editData.value = { ...daerah };
        showEditModal.value = true;
      };
  
      const handleEdit = async () => {
        try {
          const response = await fetch(`http://localhost:8080/daerah/${editData.value.id_daerah}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nama_daerah: editData.value.nama_daerah
            })
          });
  
          if (response.ok) {
            showEditModal.value = false;
            await fetchdaerahs();
            // Show success message
            successMessage.value = 'Successfully Updated Data';
            showSuccessModal.value = true;
          }
        } catch (error) {
          console.error('Error updating daerah:', error);
        }
      };
  
      const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this daerah?')) {
          try {
            const response = await fetch(`http://localhost:8080/daerah/${id}`, {
              method: 'DELETE'
            });
  
            if (response.ok) {
              await fetchdaerahs();
              successMessage.value = 'Successfully Deleted Data';
              showSuccessModal.value = true;
            }
          } catch (error) {
            console.error('Error deleting daerah:', error);
          }
        }
      };
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      onMounted(() => {
        fetchdaerahs();
      });
  
      return {
      searchQuery,
      filtereddaerahs,
      handleSearch,
        daerahs,
        isSidebarOpen,
        showAddModal,
        showEditModal,
        showSuccessModal,
        successMessage,
        formData,
        editData,
        toggleSidebar,
        handleSubmit,
        openEditModal,
        handleEdit,
        handleDelete,
        formatPrice
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