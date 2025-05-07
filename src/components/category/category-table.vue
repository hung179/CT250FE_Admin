<template>
    <div class="w-full h-full rounded-md">
        <div class="text-lg font-medium">{{ totalCategories }} Ngành hàng</div>
        <div class="w-full rounded-md border-[1px] border-zinc-400 overflow-hidden mt-5">
            <div class="w-full h-fit bg-zinc-100">
                <table class="w-full h-fit">
                    <thead class="text-zinc-600 bg-zinc-200">
                        <tr>
                            <th class="py-4 pl-6 text-left w-3/12 font-medium text-base pr-1">
                                Tên ngành hàng
                            </th>
                            <th class="py-4 text-center w-1/12 font-medium text-base">Cấp</th>
                            <th class="py-4 text-left w-6/12 font-medium text-base px-2">
                                Ngành hàng cha
                            </th>
                            <th class="py-4 text-center w-2/12 font-medium text-base">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="bg-transparent text-zinc-800">
                        <tr v-for="category in categories" :key="category._id">
                            <td class="py-4 pl-6 pr-1 text-left w-3/12 font-normal text-base">
                                {{ category.ten_NH }}
                            </td>
                            <td class="py-2 text-center w-1/12 align-middle font-normal text-base">
                                {{ category.cap_NH }}
                            </td>
                            <td
                                class="py-2 text-left px-2 w-6/12 align-middle font-normal text-base"
                            >
                                {{ findCategoryHierarchy(category) }}
                            </td>
                            <td
                                class="py-2 flex text-center align-middle font-normal text-base"
                            >
                                <div class="w-full flex flex-row space-x-2 justify-center">
                                    <NuxtLink
                                        :to="`/category/detail/${category._id}`"
                                        class="text-blue-500 rounded hover:text-blue-700 cursor-pointer text-base font-normal"
                                    >
                                        Cập nhật
                                    </NuxtLink>

                                    <p @click="deleteCategory(category)" class="text-red-500 rounded hover:text-red-700 cursor-pointer text-base font-normal">
                                        Xóa
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useToast } from "vue-toastification";

const perPage = 12;
const currentPage = ref(1);
const showDropdown = ref(false);
const allCategories = ref([]);
const categories = ref([]);
const totalCategories = computed(() => allCategories.value.length);
const totalPages = computed(() => Math.ceil(totalCategories.value / perPage));

const toast = useToast();
const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
import { useRouter } from "vue-router";

const router = useRouter();
const getCategories = async () => {
    try {
        const res = await $api.get("/categories");
        if (res.data.success) {
            allCategories.value = res.data.data;
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
    updateCategories();
};

const findCategoryHierarchy = (category) => {
    if (category.cap_NH === 1) return "Không có";
    let hierarchy = [];
    let current = category;
    while (current.idCha_NH) {
        current = allCategories.value.find((cat) => cat._id === current.idCha_NH);
        if (current) hierarchy.unshift(current.ten_NH);
    }
    return hierarchy.join(" > ");
};

const updateCategories = () => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;
    categories.value = allCategories.value.slice(start, end);
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        showDropdown.value = false;
        updateCategories();
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        updateCategories();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        updateCategories();
    }
};

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const deleteCategory = async (category) => {
    const { isConfirmed } = await Swal.fire({
        title: "Xóa ngành hàng",
        text: "Bạn có chắc chắn muốn xóa ngành hàng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
    });

    if (isConfirmed) {
        try {
            const res = await $api.delete(`/categories/${category._id}`);
            if (res.data.success) {
                toast.success("Ngành hàng đã được xóa thành công!");
                getCategories();
            } else {
                toast.error("Có lỗi xảy ra, không thể xóa ngành hàng!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Có lỗi xảy ra, không thể xóa ngành hàng!");
        }
    }
};

onMounted(() => {
    getCategories();
});
</script>
