<template>
    <NuxtLayout>
        <div class="min-w-4xl max-w-2xl w-full h-full mx-auto">
            <div class="h-fit p-6">
                <div class="bg-zinc-50 h-fit w-full rounded-lg p-8">
                    <div class="my-4">
                        <searchShippingInformation ref="componentTimKiem" @selected="handleInput">
                            <template #label>
                                <label class="font-medium text-xl mb-5"
                                    >Tìm kiếm thông tin vận chuyển</label
                                >
                            </template>
                        </searchShippingInformation>
                    </div>
                    <div class="font-medium text-xl mb-5">Cập nhật thông tin vận chuyển</div>

                    <form @submit.prevent="handleSubmit">
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48">Địa chỉ</label>

                            <select
                                :id="id"
                                v-model="selectedProvinceName"
                                class="block w-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                :class="{ 'border-red-500': error }"
                                @change="updateValue"
                            >
                                <option value="" disabled>{{ placeholder }}</option>
                                <option
                                    v-for="province in provinces"
                                    :key="province.code"
                                    :value="province.name"
                                >
                                    {{ province.name }}
                                </option>
                            </select>
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="gvc"
                                >Giá vận chuyển</label
                            >
                            <input
                                v-model="shippingInformation.gia_VC"
                                id="gvc"
                                type="text"
                                class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                                placeholder="Nhập số giá vận chuyển"
                                required
                            />
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="gvm">Giá vượt mức (đ/gram)</label>
                            <input
                            v-model="shippingInformation.giaVuotMuc_VC"
                            id="gvm"
                            type="text"
                            class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                            required
                            placeholder="đ/gram"
                            />
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="mv">Mức vượt (gram)</label>
                            <input 
                                v-model="shippingInformation.mucVuot_VC"
                                id="mv"
                                type="number"
                                class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                                placeholder="gram"
                                required
                                min="0"
                            />
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="sdt">Thời gian giao hàng</label>
                            <input
                                v-model="shippingInformation.thoiGian_VC"
                                type="number"
                                class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                                min="1"
                            />
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <button
                                class="py-auto px-6 bg-emerald-400 h-10 text-sm text-white rounded-md hover:bg-emerald-500 cursor-pointer"
                                type="submit"
                                :disabled="isSubmitting"
                            >
                                {{ isSubmitting ? "Đang cập nhật" : "Cập nhật" }}
                            </button>
                            <button
                                @click="deleteProvince"
                                v-show="isVisible"
                                class="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Xóa
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, watch, onMounted, computed } from "vue";
import Swal from "sweetalert2";

import useInformationService from "../../service/shippingInformation.service";
const props = defineProps({
    modelValue: {
        type: String,
        default: "",
    },
    id: {
        type: String,
        default: "province-dropdown",
    },
    label: {
        type: String,
        default: "Tỉnh/Thành phố",
    },
    placeholder: {
        type: String,
        default: "Chọn Tỉnh/Thành phố",
    },
    error: {
        type: String,
        default: "",
    },
    required: {
        type: Boolean,
        default: false,
    },
});
const shippingInformation = ref({
    tinh_VC: "",
    gia_VC: 0,
    giaVuotMuc_VC: 0,
    mucVuot_VC: 0,
    thoiGian_VC: 1,
});
const emit = defineEmits(["update:modelValue"]);

const provinces = ref([]);
const selectedProvinceName = ref(props.modelValue);
const loading = ref(false);
const fetchError = ref(null);
const isVisible = ref(false);
const showNotification = ref(false);
const warn = ref("");
const componentTimKiem = ref(null);
const router = useRouter();
// Theo dõi thay đổi của prop modelValue
watch(
    () => props.modelValue,
    (newValue) => {
        selectedProvinceName.value = newValue;
    }
);



// Hàm cập nhật giá trị khi dropdown thay đổi
const updateValue = () => {
    emit("update:modelValue", selectedProvinceName.value);
};

// Hàm lấy dữ liệu tỉnh thành từ API
const fetchProvinces = async () => {
    loading.value = true;
    fetchError.value = null;

    try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Sắp xếp tỉnh thành theo tên
        provinces.value = data.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", error);
        fetchError.value = "Không thể tải danh sách tỉnh thành. Vui lòng thử lại sau.";
    } finally {
        loading.value = false;
    }
};

// Lấy dữ liệu khi component được mount
onMounted(async () => {
    await fetchProvinces();
});

const informationService = useInformationService();
const isSubmitting = ref(false);
const submitMessage = ref("");
const selectedId = ref("");

const handleSubmit = async () => {
    isSubmitting.value = true;
    submitMessage.value = "";

    try {
        // Đảm bảo tinh_VC được cập nhật với tên tỉnh hiện tại
        shippingInformation.value.tinh_VC = selectedProvinceName.value;



        let result;
        if (Object.keys(data.value).length > 0) {
            result = await informationService.updateInformation(
                selectedId.value.toString(),
                shippingInformation.value
            );

            isVisible.value = false;
        } else {
            result = await informationService.sendInformation(shippingInformation.value);
            if (!result.success) {
                Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Thêm thông tin vận chuyển thành công",
            });
            }
        }
        if (result.success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Cập nhật thông tin thành công",
            });
            shippingInformation.value = {
                tinh_VC: "",
                gia_VC: 0,
                giaVuotMuc_VC: 0,
                mucVuot_VC: 0,
                thoiGian_VC: 1,
            };
            selectedProvinceName.value = "";
            if (componentTimKiem.value) {
                componentTimKiem.value.xoaTimKiem();
            }
            router.push("/");
        } else {
            submitMessage.value = `Lỗi: ${result.error}`;
        }
    } catch (err) {
        submitMessage.value = "Có lỗi xảy ra khi gửi form.";
    } finally {
        isSubmitting.value = false;
    }
};

watch(selectedProvinceName, (newValue) => {
    shippingInformation.value.tinh_VC = newValue;
});

const data = ref({});
const handleInput = (value) => {
    data.value = value;
};

watch(data, (value) => {
    if (value && Object.keys(value).length > 0) {
        isVisible.value = true;
        const { name, _id, ...rest } = value;
        shippingInformation.value = rest;

        // Nếu tinh_VC là mã code, tìm tên tỉnh tương ứng
        if (typeof value.tinh_VC === "number") {
            const province = provinces.value.find((p) => p.code === value.tinh_VC);
            if (province) {
                selectedProvinceName.value = province.name;
                shippingInformation.value.tinh_VC = province.name; // Cập nhật lại để lưu tên tỉnh
            }
        } else {
            // Nếu đã là tên tỉnh thì giữ nguyên
            selectedProvinceName.value = value.tinh_VC;
        }


        selectedId.value = _id;
    }
});

const deleteProvince = async () => {
    const result = await informationService.deleteInformation(selectedId.value.toString());
    if (result.success) {
        submitMessage.value = "Gửi thông tin thành công!";
        if (componentTimKiem.value) {
            componentTimKiem.value.xoaTimKiem();
        }

        // Reset các trường dữ liệu khác
        shippingInformation.value = {
            tinh_VC: "",
            gia_VC: 0,
            giaVuotMuc_VC: 0,
            mucVuot_VC: 0,
            thoiGian_VC: 1,
        };
        selectedProvinceName.value = "";
        isVisible.value = false;
        router.push("/");
    } else {
        submitMessage.value = `Lỗi: ${result.error}`;
    }
};

function handleClose() {
    shippingInformation.value = {
        tinh_VC: "",
        gia_VC: 0,
        giaVuotMuc_VC: 0,
        mucVuot_VC: 0,
        thoiGian_VC: 1,
    };
}
</script>
