<template>
  <div class="min-h-screen bg-gray-100">
    <div :class="{ 'lg:block': true, 'hidden': !isSidebarOpen }">
      <Sidebar :class="{ 'show': isSidebarOpen }" />
    </div>

    <div class="lg:ml-64">
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="pt-20 min-h-screen">
        <div id="bg-2" class="p-4">
          <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4">Data Produk</h1>

            <!-- Search Bar -->
          <div class="mb-4">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by nama produk, daerah, or kategori..." 
              class="w-full p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
              @input="handleSearch"
            />
          </div>

          <!-- Add New produk Modal -->
          <Modal v-if="showAddModal" @close="showAddModal = false">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Add New Data Produk</h1>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="formData.nama_produk" type="text" placeholder="Nama Produk" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                
                <select v-model="formData.id_daerah" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                  <option value="" disabled>Select Daerah</option>
                  <option v-for="daerah in daerahList" :key="daerah.id_daerah" :value="daerah.id_daerah">
                    {{ daerah.nama_daerah }}
                  </option>
                </select>

                <select v-model="formData.id_kategori" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                  <option value="" disabled>Select Kategori</option>
                  <option v-for="kategori in kategoriList" :key="kategori.id_kategori" :value="kategori.id_kategori">
                    {{ kategori.nama_kategori }}
                  </option>
                </select>

                <input v-model="formData.harga" type="number" placeholder="Harga" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="formData.deskripsi" type="text" placeholder="Deskripsi" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                
                <!-- Photo upload input -->
                <div class="col-span-2">
                  <label class="block text-white mb-2">Upload Photos (Multiple)</label>
                  <input 
                    type="file" 
                    @change="handleFileUpload"
                    multiple 
                    accept="image/*"
                    class="p-2 rounded-lg bg-black/20 border border-white/20 text-white w-full"
                  >
                </div>
                
                <!-- Preview selected images -->
                <div v-if="selectedFiles.length > 0" class="col-span-2 grid grid-cols-3 gap-2">
                  <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
                    <img :src="getPreviewUrl(file)" class="w-24 h-24 object-cover rounded">
                    <button 
                      @click.prevent="removeFile(index)" 
                      class="absolute -top-2 bg-red-500 rounded-full w-6 h-6 text-white"
                    >×</button>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" @click="showAddModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Submit</button>
              </div>
            </form>
          </Modal>

          <!-- Edit produk Modal -->
          <Modal v-if="showEditModal" @close="showEditModal = false">
            <form @submit.prevent="handleEdit" class="space-y-4">
              <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Edit Data Produk</h1>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="editData.nama_produk" type="text" placeholder="Nama Produk" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                
                <select v-model="editData.id_daerah" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                  <option v-for="daerah in daerahList" :key="daerah.id_daerah" :value="daerah.id_daerah">
                    {{ daerah.nama_daerah }}
                  </option>
                </select>

                <select v-model="editData.id_kategori" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                  <option v-for="kategori in kategoriList" :key="kategori.id_kategori" :value="kategori.id_kategori">
                    {{ kategori.nama_kategori }}
                  </option>
                </select>

                <input v-model="editData.harga" type="number" placeholder="Harga" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>
                <input v-model="editData.deskripsi" type="text" placeholder="Deskripsi" class="p-2 rounded-lg bg-black/20 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" required>

                <!-- Existing photos -->
                <div v-if="editData.foto" class="col-span-2">
                  <label class="block text-white mb-2">Current Photos</label>
                  <div class="grid grid-cols-3 gap-2">
                    <div v-for="(photo, index) in getPhotos(editData.foto)" :key="index" class="relative">
                      <img :src="`http://localhost:8080/images/produks/${photo}`" class="w-24 h-24 object-cover rounded">
                      <button 
                        @click.prevent="removeExistingPhoto(index)" 
                        class="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 text-white"
                      >×</button>
                    </div>
                  </div>
                </div>

                <!-- New photos upload -->
                <div class="col-span-2">
                  <label class="block text-white mb-2">Add New Photos</label>
                  <input 
                    type="file" 
                    @change="handleEditFileUpload"
                    multiple 
                    accept="image/*"
                    class="p-2 rounded-lg bg-black/20 border border-white/20 text-white w-full"
                  >
                </div>

                <!-- Preview new selected images -->
                <div v-if="editSelectedFiles.length > 0" class="col-span-2 grid grid-cols-3 gap-2">
                  <div v-for="(file, index) in editSelectedFiles" :key="index" class="relative">
                    <img :src="getPreviewUrl(file)" class="w-24 h-24 object-cover rounded">
                    <button 
                      @click.prevent="removeEditFile(index)" 
                      class="absolute -top-2 bg-red-500 rounded-full w-6 h-6 text-white"
                    >×</button>
                  </div>
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" @click="showEditModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Update</button>
              </div>
            </form>
          </Modal>
          <!-- Success Modal -->
          <SuccessModal
            v-if="showSuccessModal"
            :message="successMessage"
            @close="showSuccessModal = false"
          />

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
                    <th class="py-2 px-4 text-left">Nama Produk</th>
                    <th class="py-2 px-4 text-left">Nama Daerah</th>
                    <th class="py-2 px-4 text-left">Nama Kategori</th>
                    <th class="py-2 px-4 text-left">Harga</th>
                    <th class="py-2 px-4 text-left">Deskripsi</th>
                    <th class="py-2 px-4 text-left">Foto</th>
                    <th class="py-2 px-4 text-left">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredProduks" :key="item.id_produk" class="border-b border-gray-600">
                    <td class="py-2 px-4">{{ index + 1 }}</td>
                    <td class="py-2 px-4">{{ item.nama_produk }}</td>
                    <td class="py-2 px-4">{{ item.daerah.nama_daerah }}</td>
                    <td class="py-2 px-4">{{ item.kategori.nama_kategori }}</td>
                    <td class="py-2 px-4">Rp. {{ formatPrice(item.harga) }}</td>
                    <td class="py-2 px-4">{{ item.deskripsi }}</td>
                    <td class="py-2 px-4">
                      <div class="flex space-x-2">
                        <div v-if="getPhotos(item.foto).length > 0" class="relative group">
                          <!-- Show first photo as main thumbnail -->
                          <img 
                            :src="`http://localhost:8080/images/produks/${getPhotos(item.foto)[0]}`"
                            alt="Produk photo"
                            class="w-16 h-16 object-cover rounded-full cursor-pointer"
                            @click="openPhotoModal(item)"
                          >
                          <!-- Indicator for multiple photos -->
                          <span v-if="getPhotos(item.foto).length > 1" 
                                class="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            +{{ getPhotos(item.foto).length - 1 }}
                          </span>
                        </div>
                        <span v-else>No photo</span>
                      </div>
                    </td>
                    <td class="py-2 px-4">
                      <button @click="openEditModal(item)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-1">Edit</button>
                      <button @click="handleDelete(item.id_produk)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-2">Delete</button>
                    </td>
                  </tr>
                  <!-- No Results Message -->
                  <tr v-if="filteredProduks.length === 0">
                    <td colspan="8" class="py-4 px-4 text-center text-gray-300">
                      No matching products found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Photo Modal -->
        <div v-if="showPhotoModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold text-white">Product Photos</h3>
              <button @click="showPhotoModal = false" class="text-white hover:text-gray-300">
                <span class="text-2xl">&times;</span>
              </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="(photo, index) in selectedItemPhotos" :key="index" class="relative">
                <img 
                  :src="`http://localhost:8080/images/produks/${photo}`"
                  :alt="`Product photo ${index + 1}`"
                  class="w-full h-48 object-cover rounded-lg"
                >
              </div>
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
    const produks = ref([]);
    const daerahList = ref([]);
    const kategoriList = ref([]);
    const isSidebarOpen = ref(false);
    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const showSuccessModal = ref(false);
    const showPhotoModal = ref(false);
    const selectedItemPhotos = ref([]);
    const successMessage = ref('');
    const selectedFiles = ref([]);
    const editSelectedFiles = ref([]);

    const formData = ref({
      nama_produk: '',
      id_daerah: '',
      id_kategori: '',
      harga: '',
      deskripsi: '',
    });

    const editData = ref({
      id_produk: null,
      nama_produk: '',
      id_daerah: '',
      id_kategori: '',
      harga: '',
      deskripsi: '',
      foto: ''
    });

    // Fetch daerah and kategori data
    const fetchDaerah = async () => {
      try {
        const response = await fetch('http://localhost:8080/daerah');
        const data = await response.json();
        daerahList.value = data.result;
      } catch (error) {
        console.error('Error fetching daerah:', error);
      }
    };

    const fetchKategori = async () => {
      try {
        const response = await fetch('http://localhost:8080/kategori');
        const data = await response.json();
        kategoriList.value = data.result;
      } catch (error) {
        console.error('Error fetching kategori:', error);
      }
    };

    // Enhanced search functionality
    const filteredProduks = computed(() => {
      if (!searchQuery.value) return produks.value;
      
      const query = searchQuery.value.toLowerCase();
      return produks.value.filter(product => 
        product.nama_produk.toLowerCase().includes(query) ||
        product.daerah.nama_daerah.toLowerCase().includes(query) ||
        product.kategori.nama_kategori.toLowerCase().includes(query) ||
        product.deskripsi.toLowerCase().includes(query)
      );
    });

    // Debounced search
    const handleSearch = debounce(() => {
      // The filtering is handled by the computed property
    }, 300);

    // File handling functions
    const handleFileUpload = (event) => {
      const files = Array.from(event.target.files);
      selectedFiles.value = [...selectedFiles.value, ...files];
    };

    const handleEditFileUpload = (event) => {
      const files = Array.from(event.target.files);
      editSelectedFiles.value = [...editSelectedFiles.value, ...files];
    };

    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1);
    };

    const removeEditFile = (index) => {
      editSelectedFiles.value.splice(index, 1);
    };

    const removeExistingPhoto = (index) => {
      const photos = getPhotos(editData.value.foto);
      photos.splice(index, 1);
      editData.value.foto = JSON.stringify(photos);
    };

    const getPreviewUrl = (file) => {
      return URL.createObjectURL(file);
    };

    // Modified submit handlers for file upload
    const handleSubmit = async () => {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData.value).forEach(key => {
          formDataToSend.append(key, formData.value[key]);
        });
        
        selectedFiles.value.forEach(file => {
          formDataToSend.append('photos', file);
        });

        const response = await fetch('http://localhost:8080/produk', {
          method: 'POST',
          body: formDataToSend
        });

        if (response.ok) {
          showAddModal.value = false;
          await fetchProduks();
          formData.value = {
            nama_produk: '',
            id_daerah: '',
            id_kategori: '',
            harga: '',
            deskripsi: '',
          };
          selectedFiles.value = [];
          successMessage.value = 'Successfully Added New Data';
          showSuccessModal.value = true;
        }
      } catch (error) {
        console.error('Error adding produk:', error);
      }
    };

    const handleEdit = async () => {
      try {
        const formDataToSend = new FormData();
        Object.keys(editData.value).forEach(key => {
          if (key !== 'foto' && key !== 'daerah' && key !== 'kategori') {
            formDataToSend.append(key, editData.value[key]);
          }
        });
        
        // Append existing photos that weren't removed
        formDataToSend.append('existingPhotos', editData.value.foto);
        
        // Append new photos
        editSelectedFiles.value.forEach(file => {
          formDataToSend.append('photos', file);
        });

        const response = await fetch(`http://localhost:8080/produk/${editData.value.id_produk}`, {
          method: 'PATCH',
          body: formDataToSend
        });

        if (response.ok) {
          showEditModal.value = false;
          await fetchProduks();
          editSelectedFiles.value = [];
          successMessage.value = 'Successfully Updated Data';
          showSuccessModal.value = true;
        }
      } catch (error) {
        console.error('Error updating produk:', error);
      }
    };

    // Modified openEditModal to properly set edit form data
    const openEditModal = (produk) => {
      editData.value = {
        id_produk: produk.id_produk,
        nama_produk: produk.nama_produk,
        id_daerah: produk.id_daerah,
        id_kategori: produk.id_kategori,
        harga: produk.harga,
        deskripsi: produk.deskripsi,
        foto: produk.foto
      };
      editSelectedFiles.value = [];
      showEditModal.value = true;
    };

    // Helper function to parse photo JSON string
    const getPhotos = (photoJson) => {
      try {
        return JSON.parse(photoJson || '[]');
      } catch (error) {
        console.error('Error parsing photo JSON:', error);
        return [];
      }
    };

    // Function to open photo modal
    const openPhotoModal = (item) => {
      selectedItemPhotos.value = getPhotos(item.foto);
      showPhotoModal.value = true;
    };

    // Format price with Indonesian currency
    const formatPrice = (price) => {
      return new Intl.NumberFormat('id-ID').format(price);
    };

    // Fetch products data
    const fetchProduks = async () => {
      try {
        const response = await fetch('http://localhost:8080/produk');
        const data = await response.json();
        produks.value = data.result;
      } catch (error) {
        console.error('Error fetching produks:', error);
      }
    };

    // Delete handler
    const handleDelete = async (id) => {
      if (confirm('Are you sure you want to delete this produk?')) {
        try {
          const response = await fetch(`http://localhost:8080/produk/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            await fetchProduks();
            successMessage.value = 'Successfully Deleted Data';
            showSuccessModal.value = true;
          }
        } catch (error) {
          console.error('Error deleting produk:', error);
        }
      }
    };

    // Debounce function implementation
    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Toggle sidebar
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    // Lifecycle hooks
    onMounted(() => {
      fetchProduks();
      fetchDaerah();
      fetchKategori();
    });

    return {
      searchQuery,
      filteredProduks,
      handleSearch,
      produks,
      daerahList,
      kategoriList,
      isSidebarOpen,
      showAddModal,
      showEditModal,
      showSuccessModal,
      showPhotoModal,
      selectedItemPhotos,
      successMessage,
      formData,
      editData,
      selectedFiles,
      editSelectedFiles,
      toggleSidebar,
      handleSubmit,
      openEditModal,
      handleEdit,
      handleDelete,
      formatPrice,
      getPhotos,
      openPhotoModal,
      handleFileUpload,
      handleEditFileUpload,
      removeFile,
      removeEditFile,
      removeExistingPhoto,
      getPreviewUrl
    };
  }
};
</script>
  
  <style scoped>
  #bg-2 {
    background-color: #282828;
    background-size: cover;
    min-height: 90vh;
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