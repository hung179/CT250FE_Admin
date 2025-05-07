<template>
    <div class="fixed top-0 left-0 w-full h-full z-31 bg-zinc-900/30">
        <div class="flex justify-center w-full h-full py-20">
            <div class="w-fit h-full flex flex-col overflow-hidden justify-center">
                <div class="min-w-xl w-xl h-auto overflow-auto flex flex-col bg-zinc-50 rounded-lg">
                    <div class="w-full min-h-18 h-18 p-6 flex items-center">
                        <div class="flex-1 text-base font-medium text-zinc-700">
                            Danh sách thuộc tính sản phẩm
                        </div>
                        <div
                            class="h-full w-fit bg-transparent rounded-full hover:bg-zinc-100 cursor-pointer"
                            @click="emit('close')"
                        >
                            <Icon
                                name="material-symbols:close-rounded"
                                size="23"
                                class="text-zinc-700"
                            />
                        </div>
                    </div>
                    <div class="w-full min-h-18 h-fit px-6 overflow-auto">
                        <div class="w-full h-fit p-4 bg-zinc-100 rounded-md">
                            <table class="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr class="bg-gray-100">
                                        <th class="border p-2">STT</th>
                                        <th class="border p-2">Tên thuộc tính</th>
                                        <th class="border p-2">Kiểu dữ liệu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(thuocTinh, index) in danhSachThuocTinh"
                                        :key="index"
                                    >
                                        <td class="border p-2 text-center">{{ index + 1 }}</td>
                                        <td class="border p-2">{{ thuocTinh.ten_TT }}</td>
                                        <td
                                            v-if="thuocTinh.kieuDuLieu_TT === 'String'"
                                            class="border p-2"
                                        >
                                            Văn bản
                                        </td>
                                        <td
                                            v-if="thuocTinh.kieuDuLieu_TT === 'Number'"
                                            class="border p-2"
                                        >
                                            Số
                                        </td>
                                        <td
                                            v-if="thuocTinh.kieuDuLieu_TT === 'Date'"
                                            class="border p-2"
                                        >
                                            Ngày
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="w-full h-fit p-6">
                        <div class="flex h-full w-full justify-end items-center space-x-4">
                            <button
                                v-if="showAddNewButton"
                                @click="showAddNewButton = false"
                                class="px-10 py-2 w-fit h-full text-sm font-medium bg-emerald-400 hover:bg-emerald-500 text-white rounded-md cursor-pointer"
                            >
                                <span> + Thêm một thuộc tính mới</span>
                            </button>
                            <div v-if="!showAddNewButton" class="w-full">
                                <div class="flex w-full h-fit items-center">
                                    <div class="p-4 bg-zinc-100 rounded-md w-full">
                                        <div class="text-lg font-semibold">Thêm Thuộc Tính</div>
                                        <div class="flex items-center space-x-4 my-4">
                                            <input
                                                v-model="tenThuocTinh"
                                                type="text"
                                                placeholder="Tên thuộc tính"
                                                class="bg-transparent border-[1px] border-zinc-300 hover:border-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-zinc-600 p-2 rounded w-2/3"
                                                @input="kiemTraTrungLap"
                                            />
                                            <select
                                                v-model="kieuDuLieu"
                                                class="bg-transparent border-[1px] border-zinc-300 hover:border-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-zinc-600 p-2 rounded w-1/3"
                                            >
                                                <option value="String">Văn bản</option>
                                                <option value="Number">Số</option>
                                                <option value="Date">Ngày</option>
                                            </select>
                                        </div>
                                        <p v-if="thongBaoLoi" class="text-red-500 text-sm mb-2">
                                            {{ thongBaoLoi }}
                                        </p>
                                        <div class="flex justify-end space-x-2">
                                            <button
                                                @click="showAddNewButton = true"
                                                class="px-4 py-2 bg-zinc-300 rounded cursor-pointer"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                @click="themThuocTinh"
                                                :disabled="!coTheThem"
                                                :class="
                                                    coTheThem
                                                        ? 'bg-emerald-400 hover:bg-emerald-500'
                                                        : 'bg-zinc-400 cursor-not-allowed'
                                                "
                                                class="px-4 py-2 text-white rounded disabled:bg-zinc-400 cursor-pointer"
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close"]);

const danhSachThuocTinh = ref([]);

const tenThuocTinh = ref("");
const kieuDuLieu = ref("String");
const thongBaoLoi = ref("");
const showAddNewButton = ref(true);

const kiemTraTrungLap = () => {
    const isDuplicate = danhSachThuocTinh.value.some(
        (tt) => tt.ten_TT.toLowerCase() === tenThuocTinh.value.toLowerCase()
    );
    thongBaoLoi.value = isDuplicate ? "Tên thuộc tính đã tồn tại!" : "";
};

const coTheThem = computed(() => tenThuocTinh.value.trim() !== "" && !thongBaoLoi.value);

const themThuocTinh = () => {
    if (coTheThem.value) {
        const newAttribute = {
            ten_TT: tenThuocTinh.value,
            kieuDuLieu_TT: kieuDuLieu.value,
        };

        addAttribute(newAttribute);
        getAttribute();
        tenThuocTinh.value = "";
        kieuDuLieu.value = "String";
        thongBaoLoi.value = "";
        showAddNewButton.value = true; // Sau khi thêm xong, quay lại hiển thị nút "Thêm một thuộc tính mới"
    }
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
import { useRouter } from "vue-router";

const router = useRouter();
async function getAttribute() {
    try {
        const res = await $api.get("/attributes");
        if (res.data.success) {
            danhSachThuocTinh.value = res.data.data;
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

async function addAttribute(data) {
    try {
        const res = await $api.post("/attributes", data);
        if (res.data.success) {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Thêm thuộc tính thành công",
            });
            danhSachThuocTinh.value = getAttribute();
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

onMounted(() => {
    getAttribute();
});
</script>
