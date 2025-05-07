<template>
    <div>
        <ProductForm :id="id" @submit="handleSubmit" />
    </div>
</template>
<script setup>
const route = useRoute();
const id = route.params.id;

const handleSubmit = (sanPham) => {
    const formData = new FormData();
    formData.append("fileAnhBia_SP", sanPham.fileAnhBia_SP[0]);
    sanPham.fileAnh_SP.forEach((file) => {
        formData.append("fileAnh_SP", file);
    });
    formData.append("ten_SP", sanPham.ten_SP);
    formData.append("nganhHang_SP", JSON.stringify(sanPham.nganhHang_SP));
    formData.append("moTa_SP", sanPham.moTa_SP);
    if (sanPham.daAn_SP) hide(sanPham.daAn_SP);
    formData.append(`ttChiTiet_SP`, JSON.stringify(sanPham.ttChiTiet_SP));
    formData.append("ttBanHang_SP", JSON.stringify(sanPham.ttBanHang_SP));
    formData.append("phanLoai_SP", JSON.stringify(sanPham.phanLoai_SP));
    formData.append("ttAnhXoa_SP", JSON.stringify(sanPham.ttAnhXoa_SP));

    update(formData);
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
import { useRouter } from "vue-router";

const router = useRouter();
async function update(product) {
    try {
        const res = await $api.put(`products/${id}`, product);
        if (res.data.success) {
            showSuccess();
            router.push("/product");
        } else {
            router.push("/product");
        }
    } catch (error) {
        console.error("Lỗi:", error);
        showError();
        router.push("/product");
    }
}

const hide = async (daAn_SP) => {
    await $api.put(`products/state/${id}`, { state: daAn_SP });
};

import { useToast } from "vue-toastification";
const toast = useToast();

const showSuccess = () => {
    toast.success("Sản phẩm được cập nhật thành công");
};

const showError = () => {
    toast.error("Có lỗi xảy ra, không thể cập nhật sản phẩm!");
};
</script>
