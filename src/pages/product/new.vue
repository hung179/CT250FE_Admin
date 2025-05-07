<template>
    <ProductForm @submit="handleSubmit" />
</template>

<script setup>
const handleSubmit = (sanPham) => {
    const formData = new FormData();
    formData.append("fileAnhBia_SP", sanPham.fileAnhBia_SP[0]);
    sanPham.fileAnh_SP.forEach((file) => {
        formData.append("fileAnh_SP", file);
    });
    formData.append("ten_SP", sanPham.ten_SP);
    formData.append("nganhHang_SP", JSON.stringify(sanPham.nganhHang_SP));
    formData.append("moTa_SP", sanPham.moTa_SP);
    if (sanPham.daAn) formData.append("daAn", sanPham.daAn);
    formData.append(`ttChiTiet_SP`, JSON.stringify(sanPham.ttChiTiet_SP));
    formData.append("ttBanHang_SP", JSON.stringify(sanPham.ttBanHang_SP));
    formData.append("phanLoai_SP", JSON.stringify(sanPham.phanLoai_SP));

    create(formData);
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
import { useRouter } from "vue-router";

const router = useRouter();
async function create(product) {
    try {
        const res = await $api.post("products", product);
        if (res.data.success == true) {
            showSuccess();
        } else {
            router.push("/product");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        showError();
    }
    router.push("/product");
}

import { useToast } from "vue-toastification";
const toast = useToast();

const showSuccess = () => {
    toast.success("Sản phẩm được thêm thành công");
};

const showError = () => {
    toast.error("Có lỗi xảy ra, không thể thêm sản phẩm!");
};
</script>
