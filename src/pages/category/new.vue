<template>
    <CategoryForm @submit="handleSubmit"></CategoryForm>
</template>
<script setup>
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();

const handleSubmit = (nganhHang) => {
    addCategory(nganhHang);
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin

async function addCategory(data) {
    try {
        const res = await $api.post("/categories", data);
        if (res.data.success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Thêm ngành hàng thành công",
            });
            router.push("/category");
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}
</script>
