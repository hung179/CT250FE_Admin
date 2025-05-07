<template>
    <NuxtLayout>
        <div class="min-w-4xl max-w-2xl w-full h-full mx-auto">
            <div class="h-fit p-6">
                <div class="bg-zinc-50 h-fit w-full rounded-lg p-8">
                    <div class="font-medium text-xl mb-5">Thông tin liên hệ</div>
                    <form @submit.prevent="submitForm" class="">
                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="email">Email</label>
                            <input
                                v-model="email_NS"
                                id="email"
                                type="email"
                                class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                                placeholder="Nhập email"
                                required
                            />
                        </div>

                        <div class="flex items-center space-x-2 mb-4">
                            <label class="font-medium w-48" for="sdt">Số điện thoại</label>
                            <input
                                v-model="sdt_NS"
                                id="sdt"
                                type="text"
                                class="w-full h-10 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 ease-in-out hover:shadow-md"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>

                        <h2 class="text-lg font-semibold mb-4">Chọn địa chỉ nhận hàng</h2>

                        <!-- Chọn Tỉnh/Thành -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium">Tỉnh/Thành</label>
                            <select
                                v-model="selectedProvince"
                                @change="fetchDistricts"
                                class="input"
                            >
                                <option value="" disabled>Chọn tỉnh/thành</option>
                                <option
                                    v-for="province in provinces"
                                    :key="province.code"
                                    :value="province"
                                >
                                    {{ province.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Chọn Quận/Huyện -->
                        <div class="mb-4" v-if="districts.length > 0">
                            <label class="block text-sm font-medium">Quận/Huyện</label>
                            <select v-model="selectedDistrict" @change="fetchWards" class="input">
                                <option value="" disabled>Chọn quận/huyện</option>
                                <option
                                    v-for="district in districts"
                                    :key="district.code"
                                    :value="district"
                                >
                                    {{ district.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Chọn Phường/Xã -->
                        <div class="mb-4" v-if="wards.length > 0">
                            <label class="block text-sm font-medium">Phường/Xã</label>
                            <select v-model="selectedWard" class="input">
                                <option value="" disabled>Chọn phường/xã</option>
                                <option v-for="ward in wards" :key="ward.code" :value="ward">
                                    {{ ward.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Hiển thị địa chỉ đã chọn -->
                        <div v-if="selectedWard" class="mt-4 p-4 border rounded bg-gray-100">
                            <h3 class="font-semibold">Địa chỉ nhận hàng:</h3>
                            <p>{{ fullAddress }}</p>
                        </div>
                        <div class="mb-5">
                            <label for="description" class="block font-medium text-gray-700 mb-2"
                                >Cập nhật giới thiệu</label
                            >
                            <div class="relative">
                                <textarea
                                    v-model="gioiThieu_NS"
                                    id="description"
                                    name="description"
                                    rows="5"
                                    placeholder="Nhập thông tin giới thiệu của bạn tại đây..."
                                    class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y min-h-[120px] transition-all duration-200"
                                ></textarea>
                                <div
                                    class="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-1"
                                >
                                    <span id="char-count">0</span>/500
                                </div>
                            </div>
                        </div>
                        <div>
                            <button
                                class="py-auto px-6 bg-emerald-400 h-10 text-sm text-white rounded-md hover:bg-emerald-500 cursor-pointer"
                                type="submit"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </NuxtLayout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import Swal from "sweetalert2";

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const selectedProvince = ref(null);
const selectedDistrict = ref(null);
const selectedWard = ref(null);

onMounted(async () => {
    await fetchProvinces();
});

// Lấy danh sách tỉnh/thành từ API
const fetchProvinces = async () => {
    try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        provinces.value = await response.json();
    } catch (error) {
        console.error("Lỗi lấy danh sách tỉnh/thành:", error);
    }
};

// Lấy danh sách quận/huyện theo tỉnh đã chọn
const fetchDistricts = async () => {
    selectedDistrict.value = null;
    selectedWard.value = null;
    districts.value = [];
    wards.value = [];

    if (!selectedProvince.value) return;

    try {
        const response = await fetch(
            `https://provinces.open-api.vn/api/p/${selectedProvince.value.code}?depth=2`
        );
        const data = await response.json();
        districts.value = data.districts;
    } catch (error) {
        console.error("Lỗi lấy danh sách quận/huyện:", error);
    }
};

// Lấy danh sách phường/xã theo quận đã chọn
const fetchWards = async () => {
    selectedWard.value = null;
    wards.value = [];

    if (!selectedDistrict.value) return;

    try {
        const response = await fetch(
            `https://provinces.open-api.vn/api/d/${selectedDistrict.value.code}?depth=2`
        );
        const data = await response.json();
        wards.value = data.wards;
    } catch (error) {
        console.error("Lỗi lấy danh sách phường/xã:", error);
    }
};

// Tạo địa chỉ đầy đủ
const fullAddress = computed(() => {
    if (!selectedProvince.value || !selectedDistrict.value || !selectedWard.value)
        return "Chưa chọn đủ địa chỉ";
    return `${selectedWard.value.name}, ${selectedDistrict.value.name}, ${selectedProvince.value.name}`;
});
const authStore = useAuthStore();
const email_NS = ref("");
const sdt_NS = ref("");
const gioiThieu_NS = ref("");
const userId = authStore.userId;
const { $api } = useNuxtApp();
const submitForm = async () => {
    const bookstoreData = {
        email_NS: email_NS.value,
        sdt_NS: sdt_NS.value,
        diaChi_NS: fullAddress.value,
        gioiThieu_NS: gioiThieu_NS.value,
    };
    try {
        const result = await $api.put(`/admin/${userId}`, bookstoreData);
        if (result.data.success) {
            showModal.value = true;
            Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Cập nhật tin liên hệ thành công",
                });
        }
    } catch (e) {
        console.log(e);
    }
};
const showModal = ref(false);
const router = useRouter();

onMounted(() => {
    const fetchUserData = async () => {
        try {
            const response = await $api.get(`/admin/byId/${userId}`);
            if (response.data.success) {
                const userData = response.data.data;
                email_NS.value = userData.email_NS;
                sdt_NS.value = userData.sdt_NS;
                gioiThieu_NS.value = userData.gioiThieu_NS;
                
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng:", error);
        }
    };
    fetchUserData();
});
</script>

<style scoped>
.input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;
}
</style>
