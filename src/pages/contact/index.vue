<template>
    <NuxtLayout>
        <div class="min-w-4xl max-w-2xl w-full h-full mx-auto">
            <div class="h-fit p-6">
                <div class="bg-zinc-50 h-fit w-full rounded-lg p-8">
                    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
                        Thông tin Bookstore
                    </h1>

                    <div class="space-y-4 mb-6">
                        <div class="border-b pb-2">
                            <h3 class="text-sm font-medium text-gray-500">Email:</h3>
                            <p class="text-lg text-gray-800">{{ bookstoreData.email_NS }}</p>
                        </div>

                        <div class="border-b pb-2">
                            <h3 class="text-sm font-medium text-gray-500">Số điện thoại:</h3>
                            <p class="text-lg text-gray-800">{{ bookstoreData.sdt_NS }}</p>
                        </div>

                        <div class="border-b pb-2">
                            <h3 class="text-sm font-medium text-gray-500">Địa chỉ:</h3>
                            <p class="text-lg text-gray-800">{{ bookstoreData.diaChi_NS }}</p>
                        </div>

                        <div>
                            <h3 class="text-sm font-medium text-gray-500">Giới thiệu:</h3>
                            <p class="text-lg text-gray-800">{{ bookstoreData.gioiThieu_NS }}</p>
                        </div>
                    </div>

                    <div class="flex justify-center">
                        <NuxtLink
                            to="/contact/update"
                            class="bg-emerald-400 hover:text-black-500 text-white py-2 px-6 rounded-md transition duration-300 flex items-center"
                        >
                            <span>Cập nhật thông tin</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-5 w-5 ml-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                                />
                            </svg>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const bookstoreData = ref({
    email_NS: "",
    sdt_NS: "",
    diaChi_NS: "",
    gioiThieu_NS: "",
});
const authStore = useAuthStore();
const userId = authStore.userId;
const { $api } = useNuxtApp();
const getBookstoreData = async () => {
    const result = await $api.get(`/admin/byId/${userId}`);
    if (result.data.success) {
        const data = result.data.data;
        bookstoreData.value = {
            email_NS: data.email_NS,
            sdt_NS: data.sdt_NS,
            diaChi_NS: data.diaChi_NS,
            gioiThieu_NS: data.gioiThieu_NS,
        }
    }
};

onMounted(() => {
    getBookstoreData();
});
</script>
