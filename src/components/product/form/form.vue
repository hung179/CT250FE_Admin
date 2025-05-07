<template>
    <NuxtLayout>
        <div class="min-w-5xl w-full h-full max-w-7xl mx-auto">
            <div class="h-fit p-6">
                <div class="h-fit w-full rounded-lg space-y-5">
                    <div v-if="(props.id && !sanPham.isNew) || (!props.id && sanPham.isNew)">
                        <ProductFormBaseInf ref="baseInf" :sanPham="sanPham" />
                    </div>
                    <div v-if="(props.id && !sanPham.isNew) || (!props.id && sanPham.isNew)">
                        <ProductFormDetailInf :sanPham="sanPham" />
                    </div>
                    <div v-if="(props.id && !sanPham.isNew) || (!props.id && sanPham.isNew)">
                        <ProductFormSalesInf ref="salesInf" :sanPham="sanPham" />
                    </div>

                    <div
                        class="w-full h-fit px-8 py-4 rounded-lg bg-white sticky bottom-0 shadow-[0px_0px_10px_rgba(0,0,0,0.1)]"
                    >
                        <div
                            class="w-full h-fit flex items-center round-t-md justify-end space-x-4"
                        >
                            <button
                                @click="cancel()"
                                class="py-auto px-6 bg-transparent h-10 text-sm text-zinc-700 rounded-md cursor-pointer border-[1px] border-zinc-400 hover:bg-zinc-100 box-border"
                            >
                                Hủy
                            </button>
                            <button
                                @click="saveAndHide()"
                                class="py-auto px-6 bg-transparent h-10 text-sm text-zinc-700 rounded-md cursor-pointer border-[1px] border-zinc-400 hover:bg-zinc-100 box-border"
                            >
                                Lưu & Ẩn
                            </button>

                            <button
                                @click="saveAndShow()"
                                class="py-auto px-6 bg-emerald-400 h-10 text-sm text-white rounded-md hover:bg-emerald-500 cursor-pointer"
                            >
                                Lưu & Hiển thị
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps(["id", "isNew"]);

const baseInf = ref(null);
const salesInf = ref(null);
const validateForm = () => {
    return baseInf.value.validateForm() && salesInf.value.validateForm();
};

import Swal from "sweetalert2";

const saveAndHide = () => {
    Swal.fire({
        title: "Xác nhận",
        text: "Lưu và ẩn sản phẩm ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#34D399",
    }).then((result) => {
        if (result.isConfirmed) {
            sanPham.daAn_SP = true;
            submit();
        }
    });
};

const saveAndShow = () => {
    Swal.fire({
        title: "Xác nhận",
        text: "Lưu và hiển thị sản phẩm ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#34D399",
    }).then((result) => {
        if (result.isConfirmed) {
            submit();
        }
    });
};

const cancel = () => {
    Swal.fire({
        title: "Xác nhận",
        text: "Hủy thay đổi ?",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#34D399",
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/product");
        }
    });
};

const emit = defineEmits(["submit"]);
const submit = () => {
    if (validateForm()) {
        emit("submit", sanPham);
    } else {
        Swal.fire({
            title: "Lỗi lưu sản phẩm",
            text: "Không thể lưu vì sản phẩm đang có lỗi cần được chỉnh sửa.",
            icon: "error",
            confirmButtonText: "OK",
        });
    }
};
const sanPham = reactive({
    isNew: true,
    ten_SP: "",
    fileAnhBia_SP: [],
    fileAnh_SP: [],
    anh_SP: [],
    anhBia_SP: null,
    nganhHang_SP: "",
    moTa_SP: "",
    ttChiTiet_SP: [],
    ttBanHang_SP: [],
    phanLoai_SP: [],
    ttAnhXoa_SP: [],
    daAn_SP: false,
});

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
async function getProduct(id) {
    try {
        const res = await $api.get(`products/${id}`);
        sanPham.anhBia_SP = res.data.data.anhBia_SP;
        sanPham.anh_SP = res.data.data.anh_SP;
        sanPham.ten_SP = res.data.data.ten_SP;
        sanPham.nganhHang_SP = res.data.data.nganhHang_SP;
        sanPham.moTa_SP = res.data.data.moTa_SP;
        sanPham.ttBanHang_SP = res.data.data.ttBanHang_SP;
        sanPham.ttChiTiet_SP = res.data.data.ttChiTiet_SP;
        sanPham.phanLoai_SP = res.data.data.phanLoai_SP;
        sanPham.daAn_SP = res.data.data.daAn_SP;

        sanPham.isNew = false;
    } catch (error) {
        console.error("Lỗi:", error);
        showError();
    }
}

onMounted(() => {
    if (props.id) {
        getProduct(props.id);
    }
});
</script>

<style></style>
