<template>
  <NuxtLayout>
      <div class="container my-4 p-2 mx-4 bg-white shadow-md rounded-lg">
          <h1 class="text-2xl font-bold mb-6">Kết quả tìm kiếm</h1>

          <!-- Filter section -->
          <div class="flex flex-wrap mb-6 gap-4">
              <!-- Search input -->
              <div class="w-full md:w-1/3">
                  <input
                      v-model="searchKey"
                      type="text"
                      placeholder="Tìm kiếm sản phẩm..."
                      class="w-full p-2 border border-gray-300 rounded"
                      @keyup.enter="applyFilters"
                  />
              </div>

              <!-- Mã code input -->
              <div class="w-full md:w-1/6">
                  <input
                      v-model="productCode"
                      type="number"
                      placeholder="Mã sản phẩm"
                      class="w-full p-2 border border-gray-300 rounded"
                  />
              </div>

              <!-- Buttons for filter actions -->
              <div class="w-full flex justify-end gap-2">
                  <button
                      @click="resetFilters"
                      class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center"
                  >
                      <span class="mr-1">⟳</span> Làm mới
                  </button>
                  
                  <button
                      @click="applyFilters"
                      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                      Áp dụng bộ lọc
                  </button>
              </div>
          </div>

          <!-- Results section -->
          <div v-if="loading" class="text-center py-10">
              <p>Đang tải...</p>
          </div>

          <div v-else-if="searchResults.length === 0" class="text-center py-10">
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>

          <div v-else>               
              <div class="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded shadow-sm">
                  <p class="font-medium text-blue-800">
                      <span class="font-bold">{{ totalResults }}</span> sản phẩm được tìm thấy
                      <template v-if="searchKey">
                          cho từ khóa "<span class="font-bold">{{ searchKey }}</span>"
                      </template>
                  </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div
                      v-for="product in searchResults"
                      :key="product._id"
                      class="border border-gray-200 rounded p-4"
                  >
                      <!-- Product card content -->
                      <img
                          v-if="product.anhBia_SP"
                          :src="product.anhBia_SP.url"
                          alt="Ảnh sản phẩm"
                          class="w-full h-40 object-cover"
                      />
                      <div
                          v-else
                          class="w-full h-40 bg-gray-200 flex items-center justify-center"
                      >
                          <span>Không có ảnh</span>
                      </div>
                      <h3 class="font-semibold mt-2">{{ product.ten_SP }}</h3>
                      <p class="text-red-500 font-bold">
                          {{ formatPrice(getMinPrice(product)) }}
                      </p>

                      <div class="mt-2 flex justify-between">
                          <nuxt-link
                              :to="`/product/detail/${product._id}`"
                              class="text-blue-500 hover:underline"
                          >
                              Xem chi tiết
                          </nuxt-link>
                      </div>
                  </div>
              </div>

              <!-- Bottom pagination -->
              <div class="mt-6 flex justify-center" v-if="totalPages > 1">
                  <div class="flex gap-2">
                      <button
                          @click="changePage(currentPage - 1)"
                          :disabled="currentPage === 0"
                          class="px-3 py-1 border rounded"
                          :class="
                              currentPage === 0
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-white hover:bg-gray-100'
                          "
                      >
                          Trước
                      </button>

                      <button
                          v-for="page in displayedPages"
                          :key="page"
                          @click="changePage(page)"
                          class="px-3 py-1 border rounded"
                          :class="
                              currentPage === page
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white hover:bg-gray-100'
                          "
                      >
                          {{ page + 1 }}
                      </button>

                      <button
                          @click="changePage(currentPage + 1)"
                          :disabled="currentPage === totalPages - 1"
                          class="px-3 py-1 border rounded"
                          :class="
                              currentPage === totalPages - 1
                                  ? 'bg-gray-100 text-gray-400'
                                  : 'bg-white hover:bg-gray-100'
                          "
                      >
                          Sau
                      </button>
                  </div>
              </div>
          </div>
      </div>
  </NuxtLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth";

const route = useRoute();
const router = useRouter();
const { $api } = useNuxtApp();
const authStore = useAuthStore();

// State
const searchKey = ref('');
const productCode = ref("");
const searchResults = ref([]);
const loading = ref(false);
const cartCount = ref(0);

// Pagination state
const currentPage = ref(0);
const pageSize = ref(8);
const totalResults = ref(0);
const totalPages = ref(1);

// Khởi tạo từ query params (được gọi một lần khi component mounted)
function initFromQueryParams() {
  const queryParams = route.query;
  
  // Xử lý đặc biệt cho parameter 'q' từ component khác
  if (queryParams.q !== undefined) {
      searchKey.value = queryParams.q || '';
  }
  
  // Xử lý parameter 'searchKey' nếu có
  if (queryParams.searchKey !== undefined) {
      searchKey.value = queryParams.searchKey || '';
  }
  
  // Các query params khác
  if (queryParams.code !== undefined) {
      productCode.value = queryParams.code || '';
  }
  
  if (queryParams.page !== undefined) {
      currentPage.value = parseInt(queryParams.page) || 0;
  }
  
  // Thực hiện tìm kiếm ban đầu nếu có query params
  if (Object.keys(queryParams).length > 0) {
      performSearch();
  }
}

const displayedPages = computed(() => {
  if (totalPages.value <= 7) {
      return Array.from({ length: totalPages.value }, (_, i) => i);
  }

  let pages = [0];

  const startPage = Math.max(1, currentPage.value - 2);
  const endPage = Math.min(totalPages.value - 2, currentPage.value + 2);

  if (startPage > 1) {
      pages.push("...");
  }

  for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
  }

  if (endPage < totalPages.value - 2) {
      pages.push("...");
  }

  pages.push(totalPages.value - 1);

  return pages;
});

watch(
  () => route.query,
  (newQuery) => {
      
      // Xử lý đặc biệt cho parameter 'q' từ component khác (thanh tìm kiếm chính)
      if (newQuery.q !== undefined) {
          searchKey.value = newQuery.q || '';
          
          // Khi có query từ component khác, thực hiện tìm kiếm luôn
          performSearch();
          return;
      }
      
      // Cập nhật từ URL chỉ khi không phải từ nút áp dụng bộ lọc
      if (!loading.value) {
          if (newQuery.searchKey !== undefined) {
              searchKey.value = newQuery.searchKey || '';
          }

          if (newQuery.code !== undefined) {
              productCode.value = newQuery.code || '';
          }

          if (newQuery.page !== undefined) {
              currentPage.value = parseInt(newQuery.page) || 0;
          }

          // Thực hiện tìm kiếm
          performSearch();
      }
  },
  { deep: true }
);

onMounted(async () => {
  await loadCartCount();
  
  // Khởi tạo từ query params
  initFromQueryParams();
});

async function loadCartCount() {
  if (!authStore.isLoggedIn) return;

  try {
      const response = await $api.get(`/customers/cart/count?idKhachHang=${authStore.userId}`);
      cartCount.value = response.data?.count || 0;
  } catch (error) {
      console.error("Lỗi khi tải số lượng sản phẩm trong giỏ hàng", error);
  }
}

function changePage(page) {
  if (page === "...") return;
  if (page < 0 || page >= totalPages.value) return;

  currentPage.value = page;
  applyFilters(false);
}

function resetFilters() {
  searchKey.value = '';
  productCode.value = '';
  currentPage.value = 0;
  
  router.push({ path: "/search" });
  
  searchResults.value = [];
  totalResults.value = 0;
  totalPages.value = 1;
}

function applyFilters(resetPage = true) {
  if (resetPage) {
      currentPage.value = 0;
  }

  // Xây dựng query params
  const queryParams = {};
  
  if (searchKey.value) {
      queryParams.searchKey = searchKey.value;
  }
  
  if (currentPage.value > 0) {
      queryParams.page = currentPage.value;
  }

  if (productCode.value) {
      queryParams.code = productCode.value;
  }

  // Cập nhật URL để có thể bookmark/share kết quả tìm kiếm
  router.push({
      path: "/search",
      query: queryParams,
  });

  // Thực hiện tìm kiếm
  performSearch();
}

async function performSearch() {
  loading.value = true;

  try {
      // Sử dụng API sản phẩm mới theo cấu trúc backend
      let url = `/products?limit=${pageSize.value}&page=${currentPage.value}&state=1`;
      
      // Thêm từ khóa tìm kiếm nếu có
      if (searchKey.value) {
          url += `&searchKey=${encodeURIComponent(searchKey.value)}`;
      }

      // Thêm mã sản phẩm nếu có
      if (productCode.value) {
          url += `&code=${encodeURIComponent(productCode.value)}`;
      }

      // Gọi API tìm kiếm
      const response = (await $api.get(url)).data;
      
      const responseData = response.data;
      
      // Cập nhật state với kết quả
      searchResults.value = responseData.products || [];
      totalResults.value = responseData.totalProducts || 0;
      totalPages.value = Math.ceil(totalResults.value / pageSize.value);
  } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm", error);
      searchResults.value = [];
      totalResults.value = 0;
      totalPages.value = 1;
  } finally {
      loading.value = false;
  }
}



// Helper methods
function getMinPrice(product) {
  if (!product.ttBanHang_SP || product.ttBanHang_SP.length === 0) {
      return 0;
  }

  return Math.min(...product.ttBanHang_SP.map((item) => item.giaBan_BH || 0));
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
  }).format(price);
}
</script>