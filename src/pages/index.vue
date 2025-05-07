<template>
    <NuxtLayout>
        <div class="bg-white w-full h-full-screen rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 m-4">
                <div
                    v-for="product in products"
                    :key="product._id"
                    class="border border-gray-200 rounded p-4 mt-4"
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

            <!-- Pagination controls -->
            <div class="flex justify-center items-center my-5">
                <button 
                    @click="changePage(currentPage - 1)" 
                    class="mb-4 px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    :disabled="currentPage === 1"
                >
                    <span class="font-medium">Trước</span>
                </button>
                
                <div class="flex items-center mx-2">
                    <button 
                        v-for="page in displayedPages"
                        :key="page"
                        @click="changePage(page)" 
                        class="mb-4 px-4 py-2 mx-1 rounded-md"
                        :class="currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
                    >
                        {{ page }}
                    </button>
                </div>
                
                <button 
                    @click="changePage(currentPage + 1)" 
                    class="mb-4 px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    :disabled="currentPage === totalPages"
                >
                    <span class="font-medium">Tiếp</span>
                </button>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

const { $api } = useNuxtApp();
const products = reactive([]);
const currentPage = ref(1); 
const totalPages = ref(1);
const totalProducts = ref(0);
const limit = ref(12);

// Tính toán số trang hiển thị trong phân trang
const displayedPages = computed(() => {
    const pages = [];
    let startPage = Math.max(1, currentPage.value - 2);
    let endPage = Math.min(totalPages.value, currentPage.value + 2);

    // Đảm bảo luôn hiển thị 5 nút trang (nếu có đủ trang)
    if (endPage - startPage + 1 < 5 && totalPages.value >= 5) {
        if (startPage === 1) {
            endPage = Math.min(5, totalPages.value);
        } else if (endPage === totalPages.value) {
            startPage = Math.max(1, totalPages.value - 4);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    return pages;
});

// Hàm lấy dữ liệu sản phẩm theo trang
async function fetchProducts() {
    try {
        // Trừ 1 khi gửi yêu cầu vì API bắt đầu từ page=0
        const response = await $api.get(`/products/all?limit=${limit.value}&page=${currentPage.value - 1}&state=3`);
        products.length = 0; // Xóa sản phẩm cũ
        products.push(...response.data.data.products);
        totalProducts.value = response.data.data.totalProducts || 0;
        totalPages.value = Math.ceil(totalProducts.value / limit.value);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
    }
}

// Hàm chuyển trang
function changePage(page) {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    fetchProducts();
    // Cuộn lên đầu trang khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

function getMinPrice(product) {
    if (!product.ttBanHang_SP || product.ttBanHang_SP.length === 0) {
        return 0;
    }
    return Math.min(...product.ttBanHang_SP.map((item) => item.giaBan_BH || 0));
}

onMounted(() => {
    fetchProducts();
});
</script>