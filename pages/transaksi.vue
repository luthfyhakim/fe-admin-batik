<template>
    <div class="min-h-screen bg-gray-100">
      <div :class="{ 'lg:block': true, 'hidden': !isSidebarOpen }">
        <Sidebar :class="{ 'show': isSidebarOpen }" />
      </div>
  
      <div class="lg:ml-64">
        <Navbar @toggle-sidebar="toggleSidebar" />
  
        <main class="pt-20 min-h-screen">
          <div id="bg-2" class="p-4">
            <h1 class="text-center text-4xl font-bold text-white pe-4 ps-4 pb-4">Data Transaksi</h1>
  
            <!-- Search Bar -->
            <div class="mb-4">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search by Nama User..." 
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
  
            <!-- Edit transaksi Modal -->
            <Modal v-if="showEditModal" @close="showEditModal = false">
              <form @submit.prevent="handleEdit" class="space-y-4">
                <h1 class="text-center text-xl font-bold text-white pe-4 ps-4 pb-4">Edit Data transaksi</h1>
                <div class="grid grid-cols-2 gap-4">
                  <h1 class="text-xl font-bold text-white">Status Pesanan</h1>
                  <select 
                    v-model="editData.status_pesanan" 
                    class="p-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20" 
                    required
                  >
                    <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                    <option value="dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="showEditModal = false" class="px-4 py-2 text-white rounded-lg transition" id="button-2">Cancel</button>
                  <button type="submit" class="px-4 py-2 text-white rounded-lg transition" id="button-1">Update</button>
                </div>
              </form>
            </Modal>
  
            <!-- Main Content -->
            <div class="block p-6 bg-gray-500 rounded-xl bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 shadow-xl text-white mt-8">
              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="min-w-full bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
                  <thead class="bg-gray-700">
                    <tr>
                      <th class="py-2 px-4 text-left">No</th>
                      <th class="py-2 px-4 text-left">Nama Produk</th>
                      <th class="py-2 px-4 text-left">Nama User</th>
                      <th class="py-2 px-4 text-left">Size</th>
                      <th class="py-2 px-4 text-left">Quantity</th>
                      <th class="py-2 px-4 text-left">Harga Satuan</th>
                      <th class="py-2 px-4 text-left">Harga Total</th>
                      <th class="py-2 px-4 text-left">Status Pesanan</th>
                      <th class="py-2 px-4 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in filteredTransaksis" :key="item.id_transaksi" class="border-b border-gray-600">
                      <td class="py-2 px-4">{{ index + 1 }}</td>
                      <td class="py-2 px-4">{{ item.nama_produk }}</td>
                      <td class="py-2 px-4">{{ item.nama_user }}</td>
                      <td class="py-2 px-4">{{ item.size }}</td>
                      <td class="py-2 px-4">{{ item.quantity }}</td>
                      <td class="py-2 px-4">Rp. {{ formatPrice(item.harga_satuan) }}</td>
                      <td class="py-2 px-4">Rp. {{ formatPrice(item.harga_total) }}</td>
                      <td class="py-2 px-4">{{ formatStatus(item.status_pesanan) }}</td>
                      <td class="py-2 px-4">
                        <button @click="openEditModal(item)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-1">Edit</button>
                        <button @click="handleDelete(item.id_transaksi)" type="button" class="px-4 py-2 text-white rounded-lg transition m-1" id="button-2">Delete</button>
                      </td>
                    </tr>
                    <!-- No Results Message -->
                    <tr v-if="filteredTransaksis.length === 0">
                      <td colspan="8" class="py-4 px-4 text-center text-gray-300">
                        No matching transactions found
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
  import { ref, computed, onMounted } from 'vue';
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
      const transaksis = ref([]);
      const isSidebarOpen = ref(false);
      const showEditModal = ref(false);
      const showSuccessModal = ref(false);
      const successMessage = ref('');
      
      const editData = ref({
        id_transaksi: null,
        status_pesanan: ''
      });
  
      // Computed property for filtered transactions
      const filteredTransaksis = computed(() => {
        if (!searchQuery.value) return transaksis.value;
        
        const query = searchQuery.value.toLowerCase();
        return transaksis.value.filter(transaction => 
          transaction.nama_produk.toLowerCase().includes(query) ||
          transaction.size.toLowerCase().includes(query) ||
          transaction.nama_user.toLowerCase().includes(query)
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
      }, 300);
  
      const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(price);
      };
  
      const formatStatus = (status) => {
        return status.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      };
  
      const fetchTransaksis = async () => {
        try {
          const response = await fetch('http://localhost:8080/transaksi');
          const data = await response.json();
          transaksis.value = data.result;
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };
  
      const openEditModal = (transaksi) => {
        editData.value = {
          id_transaksi: transaksi.id_transaksi,
          status_pesanan: transaksi.status_pesanan
        };
        showEditModal.value = true;
      };
  
      const handleEdit = async () => {
        try {
          const response = await fetch(`http://localhost:8080/transaksi/${editData.value.id_transaksi}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status_pesanan: editData.value.status_pesanan
            })
          });
  
          if (response.ok) {
            showEditModal.value = false;
            await fetchTransaksis();
            successMessage.value = 'Successfully Updated Transaction Status';
            showSuccessModal.value = true;
          } else {
            throw new Error('Failed to update transaction');
          }
        } catch (error) {
          console.error('Error updating transaction:', error);
          // You might want to show an error message to the user here
        }
      };
  
      const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
          try {
            const response = await fetch(`http://localhost:8080/transaksi/${id}`, {
              method: 'DELETE'
            });
  
            if (response.ok) {
              await fetchTransaksis();
              successMessage.value = 'Successfully Deleted Transaction';
              showSuccessModal.value = true;
            } else {
              throw new Error('Failed to delete transaction');
            }
          } catch (error) {
            console.error('Error deleting transaction:', error);
            // You might want to show an error message to the user here
          }
        }
      };
  
      const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
      };
  
      onMounted(() => {
        fetchTransaksis();
      });
  
      return {
        searchQuery,
        filteredTransaksis,
        handleSearch,
        transaksis,
        isSidebarOpen,
        showEditModal,
        showSuccessModal,
        successMessage,
        editData,
        toggleSidebar,
        openEditModal,
        handleEdit,
        handleDelete,
        formatPrice,
        formatStatus
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