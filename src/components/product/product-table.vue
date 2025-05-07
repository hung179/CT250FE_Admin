<template>
    <div class="min-w-fit w-full h-full bg-transparent">
        <div class="w-full h-fit flex justify-between items-center space-x-6">
            <div
                class="flex flex-3/5 items-center gap-2 border border-zinc-400 hover:border-zinc-400 focus-within:border-zinc-500 rounded-md px-3 py-2"
            >
                <span class="text-sm text-zinc-700">Tìm kiếm sản phẩm</span>
                <input
                    v-model="inputValue"
                    @input="handleInput"
                    type="text"
                    class="flex-1 text-sm text-zinc-900 bg-transparent outline-none"
                    placeholder="Nhập tên, mã sản phẩm"
                />
            </div>
            <div class="flex items-center flex-2/5 h-fit space-x-3 justify-end">
                <button
                    @click="search()"
                    class="py-auto px-4 bg-transparent h-9 text-sm text-emerald-500 rounded-md cursor-pointer border-[1px] border-emerald-500 hover:bg-emerald-200/10 box-border"
                >
                    Áp dụng
                </button>
                <button
                    @click="clear()"
                    class="py-auto px-4 bg-transparent h-9 text-sm text-zinc-700 rounded-md cursor-pointer border-[1px] border-zinc-400 hover:bg-zinc-200/70 box-border"
                >
                    Nhập lại
                </button>
            </div>
        </div>

        <div class="mt-5 text-lg font-medium">{{ totalProducts }} Sản phẩm</div>
        <div class="w-full rounded-md border-[1px] border-zinc-400 overflow-hidden mt-5">
            <div class="w-fill h-fit bg-zinc-100 pl-6 pr-6">
                <table class="w-full h-fit">
                    <thead class="text-zinc-600">
                        <tr>
                            <th class="py-4 text-left w-4/9 font-normal text-base">Tên sản phẩm</th>
                            <th class="py-4 text-left w-1/9 font-normal text-base">Doanh số</th>
                            <th class="py-4 text-left w-2/9 font-normal text-base">Giá (VNĐ)</th>
                            <th class="py-4 text-left w-1/9 font-normal text-base">Kho hàng</th>
                            <th class="py-4 text-left w-1/9 font-normal text-base">Thao tác</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div class="bg-transparent h-fit w-full flex flex-col px-6">
                <div
                    v-for="(product, index) in products"
                    :key="index"
                    class="w-full h-fit border-b py-4 border-zinc-400"
                >
                    <table class="w-full h-fit">
                        <thead class="bg-transparent text-zinc-800">
                            <tr>
                                <th class="py-4 pl-4 text-left w-4/9 font-medium text-base">
                                    <div class="w-full h-full bg-transparent flex">
                                        <div
                                            class="w-14 h-14 flex justify-center rounded-sm overflow-hidden"
                                        >
                                            <img
                                                :src="product.anhBia_SP.url"
                                                class="h-full object-contain"
                                                alt="Ảnh bìa sản phẩm"
                                            />
                                        </div>
                                        <div class="flex-1 px-5 space-y-2">
                                            <div
                                                v-if="product.daAn_SP == true"
                                                class="text-xs bg-zinc-200 p-1 w-fit h-fit rounded-sm font-medium"
                                            >
                                                Đã ẩn
                                            </div>
                                            <NuxtLink
                                                :to="`/product/detail/${product._id}`"
                                                class="line-clamp-2 cursor-pointer"
                                                >{{ product.ten_SP }}</NuxtLink
                                            >
                                            <div class="text-xs font-normal">
                                                Mã: {{ formattedMaSP(product.ma_SP) }}
                                            </div>
                                        </div>
                                    </div>
                                </th>
                                <th class="py-2 text-left w-1/9 align-top font-medium text-base">
                                    {{ totalSales(product.ttBanHang_SP) }}
                                </th>
                                <th class="py-2 text-left w-2/9 align-top font-medium text-base">
                                    {{
                                        product.ttBanHang_SP.length === 1 &&
                                        !hasOptions(product.ttBanHang_SP[0])
                                            ? formatPrice(product.ttBanHang_SP[0].giaBan_BH)
                                            : priceRange(product.ttBanHang_SP)
                                    }}
                                </th>
                                <th class="py-2 text-left w-1/9 align-top font-medium text-base">
                                    {{ totalStock(product.ttBanHang_SP) }}
                                </th>
                                <th class="py-2 text-left w-1/9 align-top font-medium text-base">
                                    <div class="w-full flex flex-col space-y-2">
                                        <NuxtLink
                                            :to="`/product/detail/${product._id}`"
                                            class="text-blue-500 rounded hover:text-blue-700 cursor-pointer text-base font-normal"
                                        >
                                            Cập nhật
                                        </NuxtLink>
                                        <span
                                            @click="remove(product._id, index)"
                                            v-if="product.daAn_SP"
                                            class="text-blue-500 rounded hover:text-blue-700 cursor-pointer text-base font-normal"
                                        >
                                            Xóa
                                        </span>
                                        <span
                                            @click="updateState(product._id, false, index)"
                                            v-if="product.daAn_SP"
                                            class="text-blue-500 rounded hover:text-blue-700 cursor-pointer text-base font-normal"
                                        >
                                            Hiển thị
                                        </span>
                                        <span
                                            @click="hide(product._id, index)"
                                            v-if="!product.daAn_SP"
                                            class="text-blue-500 rounded hover:text-blue-700 cursor-pointer text-base font-normal"
                                        >
                                            Ẩn
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            v-if="
                                product.ttBanHang_SP.length > 1 ||
                                hasOptions(product.ttBanHang_SP[0])
                            "
                        >
                            <tr
                                v-for="(sale, saleIndex) in product.ttBanHang_SP"
                                :key="`${index}-${saleIndex}`"
                                class="text-zinc-700"
                            >
                                <td class="pl-30 py-2">
                                    <div class="w-full h-full bg-transparent font-normal text-base">
                                        {{ getOptionName(index, sale.tuyChonPhanLoai1_BH, 0)
                                        }}{{
                                            sale.tuyChonPhanLoai2_BH
                                                ? " - " +
                                                  getOptionName(index, sale.tuyChonPhanLoai2_BH, 1)
                                                : ""
                                        }}
                                    </div>
                                </td>
                                <td class="py-2 align-top font-normal text-base">
                                    {{ sale.doanhSo_BH }}
                                </td>
                                <td class="py-2 align-top font-normal text-base">
                                    {{ formatPrice(sale.giaBan_BH) }}
                                </td>
                                <td class="py-2 align-top font-normal text-base">
                                    {{ sale.khoHang_BH }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="w-full h-fit p-6">
                <div class="flex justify-between items-center">
                    <span>Trang {{ currentPage }} / {{ totalPages }}</span>

                    <div class="flex space-x-2">
                        <button
                            @click="prevPage"
                            :disabled="currentPage === 1"
                            class="rounded-md disabled:cursor-not-allowed w-fit h-10 flex items-center cursor-pointer"
                        >
                            <Icon name="ic:round-keyboard-arrow-left" size="24" />
                        </button>
                        <div class="relative">
                            <button
                                @click="toggleDropdown"
                                class="bg-zinc-100 rounded-md w-14 h-10 flex items-center justify-center cursor-pointer"
                            >
                                {{ currentPage }}
                            </button>
                            <div
                                v-if="showDropdown"
                                class="absolute right-0 bottom-full w-full bg-white border-[1px] border-zinc-400 rounded-md shadow-md max-h-[150px] overflow-y-auto"
                            >
                                <div
                                    v-for="page in totalPages"
                                    :key="page"
                                    @click="changePage(page)"
                                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {{ page }}
                                </div>
                            </div>
                        </div>
                        <button
                            @click="nextPage"
                            :disabled="currentPage === totalPages"
                            class="rounded-md disabled:cursor-not-allowed w-fit h-10 flex items-center cursor-pointer"
                        >
                            <Icon name="ic:round-keyboard-arrow-right" size="24" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
const inputValue = ref("");
const searchKey = ref("");
const code = ref("");

const clear = () => {
    inputValue.value = "";
    getProducts(0);
    currentPage.value = 1;
};

const search = () => {
    if (inputValue.value != "") {
        findProducts(0);
        currentPage.value = 1;
    }
};

const handleInput = () => {
    if (/^\d+$/.test(inputValue.value)) {
        // Nếu chỉ có số, gán vào code
        code.value = inputValue.value;
        searchKey.value = "";
    } else {
        // Nếu có chữ, gán vào searchKey
        searchKey.value = inputValue.value;
        code.value = "";
    }
};

const totalProducts = ref(0);
const products = ref([]);

// Tổng doanh số
const totalSales = (salesInfo) => salesInfo.reduce((sum, sale) => sum + sale.doanhSo_BH, 0);

// Tổng kho hàng
const totalStock = (salesInfo) => salesInfo.reduce((sum, sale) => sum + sale.khoHang_BH, 0);

// Giá thấp nhất
const minPrice = (salesInfo) => Math.min(...salesInfo.map((sale) => sale.giaBan_BH));

// Giá cao nhất
const maxPrice = (salesInfo) => Math.max(...salesInfo.map((sale) => sale.giaBan_BH));

// Trả về giá hiển thị
const priceRange = (salesInfo) => {
    const min = minPrice(salesInfo);
    const max = maxPrice(salesInfo);
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
};

// Kiểm tra xem có tùy chọn không
const hasOptions = (sale) => sale.tuyChonPhanLoai1_BH || sale.tuyChonPhanLoai1_BH;

// Định dạng giá tiền
const formatPrice = (price) => price.toLocaleString("vi-VN");

const formattedMaSP = (code) => {
    return code.toString().padStart(8, "0");
};

const getOptionName = (productIndex, optIndex, classIndex) => {
    products.value[productIndex]?.phanLoai_SP?.[classIndex]?.tuyChon_PL?.[optIndex]?.ten_TC || "Không có";
};

const perPage = 10;
const currentPage = ref(1);
const showDropdown = ref(false);

// Tổng số trang
const totalPages = computed(() => Math.ceil(totalProducts.value / perPage));

// Đổi trang
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        showDropdown.value = false;
        if (inputValue.value != "") {
            findProducts(currentPage.value - 1);
        } else {
            getProducts(currentPage.value - 1);
        }
    }
};
// Nút trước / sau
const prevPage = () => {
    currentPage.value > 1 && currentPage.value--;
    if (inputValue.value != "") {
        findProducts(currentPage.value - 1);
    } else {
        getProducts(currentPage.value - 1);
    }
};
const nextPage = () => {
    currentPage.value < totalPages.value && currentPage.value++;
    if (inputValue.value != "") {
        findProducts(currentPage.value - 1);
    } else {
        getProducts(currentPage.value - 1);
    }
};

// Toggle dropdown
const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin

import { useRouter, useRoute } from "vue-router";

const route = useRoute();
const state = computed(() => {
    if (route.path.includes("/product/all")) return 0;
    if (route.path.includes("/product/live")) return 1;
    if (route.path.includes("/product/hidden")) return 2;
    return null; // Mặc định nếu không khớp
});
async function getProducts(page) {
    try {
        const res = await $api.get("products/all", {
            params: {
                page: String(page),
                limit: String(perPage),
                state: state.value !== null ? String(state.value) : undefined,
            },
        });
        if (res.data.success == true) {
            products.value = res.data.data.products;
            if (page == 0) {
                totalProducts.value = res.data.data.totalProducts;
            }
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

async function findProducts(page) {
    try {
        let res;
        if (searchKey.value != "") {
            res = await $api.get("products", {
                params: {
                    searchKey: searchKey.value,
                    page: String(page),
                    state: state.value !== null ? String(state.value) : undefined,
                },
            });
        } else if (code.value != "") {
            res = await $api.get("products", {
                params: {
                    code: code.value,
                    page: String(page),
                    state: state.value !== null ? String(state.value) : undefined,
                },
            });
        }
        if (res.data.success == true) {
            products.value = res.data.data.products;
            if (page == 0) {
                totalProducts.value = res.data.data.totalProducts;
            }
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

onMounted(() => {
    getProducts(0);
});

const hide = (id, index) => {
    Swal.fire({
        title: "Bạn có chắc chắn muốn ẩn sản phẩm này?",
        text: "Người mua sẽ không thể xem hoặc mua sản phẩm đã ẩn.",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#34D399",
    }).then((result) => {
        if (result.isConfirmed) {
            updateState(id, true, index);
        } else {
            console.log("not hide");
        }
    });
};

const remove = (id, index) => {
    Swal.fire({
        title: "Xóa sản phẩm",
        text: "Bạn có chắc muốn xóa sản phẩm này? Lưu ý: Sau khi xóa, bạn không thể hoàn tác hay khôi phục sản phẩm.",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#34D399",
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProduct(id, index);
        } else {
            console.log("not remove");
        }
    });
};

async function updateState(id, state, index) {
    try {
        const res = await $api.put(`products/state/${id}`, { state });
        if (res.data.success) products.value[index] = res.data.data;
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

async function deleteProduct(id, index) {
    try {
        const res = await $api.delete(`products/${id}`);
        if (res.data.success) {
            products.value.splice(index, 1);
            showSuccess();
        }
    } catch (error) {
        console.error("Lỗi:", error);
        showError();
    }
}

import { useToast } from "vue-toastification";
const toast = useToast();

const showSuccess = () => {
    toast.success("Sản phẩm được xóa thành công");
};

const showError = () => {
    toast.error("Có lỗi xảy ra, không thể xóa sản phẩm!");
};
</script>
