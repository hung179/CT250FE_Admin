<template>
    <div class="h-fit w-full p-8 rounded-lg bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
        <div class="text-xl font-semibold text-zinc-900 w-full rounded-t-xl bg-zinc-50 mb-10">
            Thông tin cơ bản
        </div>
        <!-- Ảnh bìa -->
        <div class="w-full h-fit">
            <div class="w-full h-fit flex">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Ảnh bìa sản phẩm
                </div>
                <div class="flex-1 flex">
                    <div v-if="props.sanPham.anhBia_SP" class="relative group w-20 h-20">
                        <!-- Hiển thị ảnh sau khi chọn -->
                        <img
                            :src="props.sanPham.anhBia_SP.url"
                            alt="Product Image"
                            class="w-full h-full object-cover border-[1px] border-zinc-300 rounded-md"
                        />
                        <div
                            @click="deleteImgCover"
                            class="absolute bottom-0 w-full h-fit bg-zinc-200 rounded-b-md group-hover:flex justify-center items-center py-1 hidden cursor-pointer"
                        >
                            <Icon
                                name="material-symbols:delete-outline-rounded"
                                size="18"
                                class="text-white"
                            />
                        </div>
                    </div>
                    <div
                        v-else-if="props.sanPham.fileAnhBia_SP.length != 0"
                        class="relative group w-20 h-20"
                    >
                        <!-- Hiển thị ảnh sau khi chọn -->
                        <img
                            :src="imageCover"
                            alt="Product Image1"
                            class="w-full h-full object-cover border-[1px] border-zinc-300 rounded-md"
                        />
                        <div
                            @click="removeImgCover"
                            class="absolute bottom-0 w-full h-fit bg-zinc-200 rounded-b-md group-hover:flex justify-center items-center py-1 hidden cursor-pointer"
                        >
                            <Icon
                                name="material-symbols:delete-outline-rounded"
                                size="18"
                                class="text-white"
                            />
                        </div>
                    </div>
                    <div
                        v-else
                        @click="$refs.file.click()"
                        class="w-20 h-20 border-[1px] border-zinc-400 rounded-md border-dashed bg-transparent hover:bg-emerald-200/20 hover:border-emerald-400 cursor-pointer"
                    >
                        <div class="w-full h-full flex flex-col justify-center items-center">
                            <Icon
                                name="material-symbols:add-photo-alternate-outline-rounded"
                                size="28px"
                                class="text-emerald-400"
                            />
                            <p class="text-xs text-center">Thêm hình ảnh</p>
                        </div>
                    </div>
                    <div class="h-full flex-1 ml-10 mt-2 text-xs text-zinc-600">
                        <ul class="list-disc">
                            <li>Tải lên hình ảnh 1:1.</li>
                            <li>
                                Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Gợi ý,...
                                Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm
                                của bạn
                            </li>
                        </ul>
                    </div>
                </div>

                <input
                    ref="file"
                    type="file"
                    class="hidden"
                    accept="image/*"
                    @change="handleFileChange_imgCover"
                />
            </div>
            <p
                v-if="
                    validateField(props.sanPham.fileAnhBia_SP, 'anhBia_SP') !== true &&
                    validateField(props.sanPham.anhBia_SP) !== true
                "
                class="pl-54 text-xs text-red-500 pt-2"
            >
                {{ validateField(props.sanPham.fileAnhBia_SP, "anhBia_SP") }}
            </p>
        </div>

        <!-- Ảnh sản phẩm -->
        <div class="w-full h-fit mt-10">
            <div class="w-full h-fit flex">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Ảnh sản phẩm
                </div>
                <div class="flex-1">
                    <div class="flex space-x-2 flex-wrap">
                        <!-- Hiển thị ảnh sản phẩm -->
                        <div
                            v-for="(image, index) in props.sanPham.anh_SP"
                            :key="index"
                            class="relative group w-20 h-20 rounded-md"
                        >
                            <!-- Hiển thị ảnh -->
                            <img
                                :src="image.url"
                                alt="Product Image"
                                class="w-full h-full object-cover rounded-md border-[1px] border-zinc-300"
                            />
                            <div
                                @click="deleteImg(index, image.public_id)"
                                class="absolute bottom-0 w-full h-fit bg-zinc-200/90 rounded-b-md group-hover:flex justify-center items-center py-1 hidden cursor-pointer"
                            >
                                <Icon
                                    name="material-symbols:delete-outline-rounded"
                                    size="18"
                                    class="text-white"
                                />
                            </div>
                        </div>
                        <!-- Hiển thị các ảnh đã chọn -->
                        <div
                            v-for="(image, index) in images"
                            :key="index"
                            class="relative group w-20 h-20 rounded-md"
                        >
                            <!-- Hiển thị ảnh -->
                            <img
                                :src="image"
                                alt="Product Image"
                                class="w-full h-full object-cover rounded-md border-[1px] border-zinc-300"
                            />
                            <div
                                @click="removeImg(index)"
                                class="absolute bottom-0 w-full h-fit bg-zinc-200/90 rounded-b-md group-hover:flex justify-center items-center py-1 hidden cursor-pointer"
                            >
                                <Icon
                                    name="material-symbols:delete-outline-rounded"
                                    size="18"
                                    class="text-white"
                                />
                            </div>
                        </div>

                        <!-- Nếu chưa đủ 9 ảnh, hiển thị thêm ô chọn ảnh -->
                        <div
                            v-if="images.length < 9"
                            @click="$refs.files.click()"
                            class="w-20 h-20 border-[1px] border-zinc-400 rounded-md border-dashed bg-transparent hover:bg-emerald-200/20 hover:border-emerald-400 cursor-pointer"
                        >
                            <div class="w-full h-full flex flex-col justify-center items-center">
                                <Icon
                                    name="material-symbols:add-photo-alternate-outline-rounded"
                                    size="28px"
                                    class="text-emerald-400"
                                />
                                <p class="text-xs text-center">
                                    Thêm hình ảnh ({{ totalImg }}/{{ maxFiles }})
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input file ẩn -->
                <input
                    ref="files"
                    type="file"
                    multiple
                    class="hidden"
                    accept="image/*"
                    @change="handleFileChange_imgs"
                    :disabled="images.length >= 9"
                />
            </div>
        </div>

        <!-- Tên sản phẩm  -->
        <div class="w-full h-fit mt-10">
            <div class="w-full h-fit flex items-center">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Tên sản phẩm
                </div>
                <div class="relative flex-1">
                    <input
                        type="text"
                        id="p_name"
                        v-model="props.sanPham.ten_SP"
                        placeholder="Nhập tên sản phẩm"
                        :maxlength="120"
                        class="w-full text-sm text-zinc-900 bg-transparent border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md h-10 outline-none pl-3 pr-20 focus:border-zinc-400"
                    />
                    <div class="absolute right-0 top-0 w-20 h-10 flex items-center">
                        <div class="h-6 w-[1px] bg-zinc-300"></div>
                        <p class="w-full text-center mx-2 text-zinc-400">
                            {{ props.sanPham.ten_SP.length }}/120
                        </p>
                    </div>
                </div>
            </div>
            <p
                v-if="validateField(props.sanPham.ten_SP, 'ten_SP') !== true"
                class="pl-54 text-xs text-red-500 pt-2"
            >
                {{ validateField(props.sanPham.ten_SP, "ten_SP") }}
            </p>
        </div>

        <!-- Ngành hàng -->
        <div class="w-full h-fit mt-10">
            <div class="w-full h-fit flex items-center">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900">
                    <span class="text-red-400 mr-1">*</span>
                    Ngành hàng
                </div>
                <div class="relative flex-1 cursor-pointer group" @click="showCategoryTable = true">
                    <input
                        type="text"
                        id="p_category"
                        v-model="formattedCategoriesSelected"
                        placeholder="Chọn ngành hàng"
                        disabled
                        class="w-full pointer-events-none cursor-pointer text-sm text-zinc-900 bg-transparent border-[1px] border-zinc-300 group-hover:border-zinc-400 rounded-md h-10 outline-none pl-3 pr-20 focus:border-zinc-400"
                    />
                    <div class="absolute right-0 top-0 w-fit h-10 flex items-center justify-center">
                        <div class="h-6 w-[1px] bg-zinc-300"></div>
                        <Icon name="ic:outline-edit" class="text-zinc-400 mx-4" size="20px" />
                    </div>
                </div>
            </div>
            <p
                v-if="validateField(formattedCategoriesSelected) !== true"
                class="pl-54 text-xs text-red-500 pt-2"
            >
                {{ validateField(formattedCategoriesSelected) }}
            </p>
        </div>
        <CategoryTableForm
            v-if="showCategoryTable"
            @close="showCategoryTable = false"
            @confirm="handlecategoriesSelected"
            :categoriesSelected="categorySelected"
            :categories="categories"
        />

        <!-- Mô tả sản phẩm -->
        <div class="w-full h-fit mt-10">
            <div class="w-full h-fit flex">
                <div class="w-48 mr-6 flex justify-end text-sm text-zinc-900" @click="a()">
                    <span class="text-red-400 mr-1">*</span>
                    Mô tả sản phẩm
                </div>
                <div class="flex-1 flex flex-col items-end">
                    <textarea
                        id="p_describe"
                        v-model="props.sanPham.moTa_SP"
                        :maxlength="3000"
                        class="w-full text-sm text-zinc-900 bg-transparent border-[1px] border-zinc-300 hover:border-zinc-400 rounded-md h-48 outline-none p-3 focus:border-zinc-400 resize-none overflow-y-auto"
                    ></textarea>
                    <div class="right-0 w-fit h-fit flex items-center">
                        <p class="w-full text-center mx-2 text-zinc-400">
                            {{ props.sanPham.moTa_SP.length }}/3000
                        </p>
                    </div>
                </div>
            </div>
            <p
                v-if="validateField(props.sanPham.moTa_SP, 'moTa_SP') !== true"
                class="pl-54 text-xs text-red-500 pt-2"
            >
                {{ validateField(props.sanPham.moTa_SP, "moTa_SP") }}
            </p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["sanPham"]);

const totalImg = ref(0);
const imageCover = ref(null);

const handleFileChange_imgCover = (event) => {
    const file = event.target.files[0];
    if (file) {
        props.sanPham.fileAnhBia_SP?.push(file);
        const reader = new FileReader();
        reader.onload = () => {
            imageCover.value = reader.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = "";
};

const images = ref([]);
const maxFiles = 9;

const handleFileChange_imgs = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    if (filesArray.length > 0) {
        const filesToProcess = filesArray.slice(0, maxFiles - images.value.length);

        filesToProcess.forEach((file) => {
            props.sanPham.fileAnh_SP?.push(file);
            totalImg.value++;
            const reader = new FileReader();
            reader.onload = () => {
                images.value.push(reader.result);
            };
            reader.readAsDataURL(file);
        });
    }
};

const removeImgCover = () => {
    imageCover.value = null;
    props.sanPham.fileAnhBia_SP = [];
};

const deleteImgCover = () => {
    props.sanPham.anhBia_SP = null;
    props.sanPham.ttAnhXoa_SP?.push(props.sanPham.anhBia_SP?.public_id);
};

const removeImg = (index) => {
    totalImg.value--;
    images.value.splice(index, 1);
};

const deleteImg = (index, public_id) => {
    props.sanPham.anh_SP.splice(index, 1);
    props.sanPham.ttAnhXoa_SP?.push(public_id);
};

const categories = ref([]);

const getCategoryAttributes = (categoryId) => {
    let attrs = [];
    let seen = new Set(); // Tránh trùng lặp thuộc tính
    let currentCategory = categories.value.find((cat) => cat._id === categoryId);

    while (currentCategory) {
        if (currentCategory.dsThuocTinh_NH?.length) {
            currentCategory.dsThuocTinh_NH.forEach((attr) => {
                if (!seen.has(attr)) {
                    seen.add(attr);
                    attrs.push({ thuocTinh_CTSP: attr, giaTri_CTSP: "" }); // Lưu theo cặp
                }
            });
        }
        if (!currentCategory.idCha_NH) break;
        currentCategory = categories.value.find((cat) => cat._id === currentCategory.idCha_NH);
    }

    return attrs;
};

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin
async function getCategory() {
    try {
        const res = await $api.get("/categories");
        if (res.data.success) {
            categories.value = res.data.data;
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}

const categorySelected = ref(null);

const findCategoryPath = (id) => {
    const category = categories.value.find((cat) => cat._id === id);
    if (!category) return { category1: null, category2: null, category3: null };

    if (category.cap_NH === 1) {
        return { category1: category, category2: null, category3: null };
    }

    if (category.cap_NH === 2) {
        const parent1 = categories.value.find((cat) => cat._id === category.idCha_NH);
        return { category1: parent1 || null, category2: category, category3: null };
    }

    if (category.cap_NH === 3) {
        const parent2 = categories.value.find((cat) => cat._id === category.idCha_NH);
        const parent1 = categories.value.find((cat) => cat._id === parent2?.idCha_NH);
        return { category1: parent1 || null, category2: parent2 || null, category3: category };
    }

    return { category1: null, category2: null, category3: null };
};

const getCategoryPathString = (_id) => {
    const categoryPath = findCategoryPath(_id);
    categorySelected.value = findCategoryPath(_id);
    return [
        categoryPath.category1?.ten_NH,
        categoryPath.category2?.ten_NH,
        categoryPath.category3?.ten_NH,
    ]
        .filter(Boolean)
        .join(" > ");
};

const formattedCategoriesSelected = ref("Chọn ngành hàng");

const updateCategoriesSelected = (value) => {
    if (!value) {
        formattedCategoriesSelected.value = "Chọn ngành hàng";
        categorySelected.value = { category1: null, category2: null, category3: null };
        return;
    }
    
    // Trường hợp value là một đối tượng { cap1_NH, cap2_NH, cap3_NH }
    if (typeof value === 'object' && value !== null) {
        // Tìm các đối tượng category tương ứng
        let category1Obj = null;
        let category2Obj = null;
        let category3Obj = null;
        
        if (value.cap1_NH) {
            category1Obj = categories.value.find(cat => cat._id === value.cap1_NH);
        }
        
        if (value.cap2_NH) {
            category2Obj = categories.value.find(cat => cat._id === value.cap2_NH);
        }
        
        if (value.cap3_NH) {
            category3Obj = categories.value.find(cat => cat._id === value.cap3_NH);
        }
        
        // Cập nhật categorySelected
        categorySelected.value = {
            category1: category1Obj,
            category2: category2Obj,
            category3: category3Obj
        };
        
        // Cập nhật đường dẫn hiển thị
        formattedCategoriesSelected.value = [
            category1Obj?.ten_NH,
            category2Obj?.ten_NH,
            category3Obj?.ten_NH
        ].filter(Boolean).join(" > ");
        
        // Đảm bảo nganhHang_SP vẫn duy trì định dạng { cap1_NH, cap2_NH, cap3_NH }
        if (!props.sanPham.nganhHang_SP || typeof props.sanPham.nganhHang_SP !== 'object') {
            props.sanPham.nganhHang_SP = value;
        }
    } 
    // Trường hợp value là một ID đơn lẻ (cách cũ)
    else if (typeof value === 'string') {
        formattedCategoriesSelected.value = getCategoryPathString(value);
    }
};


const handlecategoriesSelected = (data) => {
    // Lưu categoryObject từ CategoryTableForm
    props.sanPham.nganhHang_SP = data.categoryObject;
    
    // Cập nhật đường dẫn hiển thị và categorySelected
    updateCategoriesSelected(data.categoryObject);
    
    // Lấy ID danh mục cuối cùng để lấy thuộc tính
    const finalId = data._id;
    if (finalId) {
        props.sanPham.ttChiTiet_SP = getCategoryAttributes(finalId);
    }
};
const validateField = (value, fieldType) => {
    if (fieldType === "anhBia_SP" && (!value || value.length === 0 || value === null))
        return "Vui lòng tải lên ảnh bìa";

    if (!value) return "Không được để trống ô";

    if (fieldType === "ten_SP" && value.length < 10) return "Tên sản phẩm phải có ít nhất 10 ký tự";

    if (fieldType === "moTa_SP" && value.length < 100) return "Mô tả sản phẩm ít nhất 100 ký tự";

    return true;
};

const validateForm = () => {
    if (
        validateField(props.sanPham.fileAnhBia_SP, "anhBia_SP") !== true &&
        validateField(props.sanPham.anhBia_SP, "anhBia_SP") !== true
    )
        return false;
    if (validateField(props.sanPham.nganhHang_SP) !== true) return false;
    if (validateField(props.sanPham.ten_SP, "ten_SP") !== true) return false;
    if (validateField(props.sanPham.moTa_SP, "moTa_SP") !== true) return false;

    return true;
};

onMounted(async () => {
    await getCategory();
    
    // Nếu có dữ liệu nganhHang_SP từ backend
    if (props.sanPham.nganhHang_SP) {
        // Đảm bảo nganhHang_SP là đối tượng
        if (typeof props.sanPham.nganhHang_SP === 'string') {
            const categoryPath = findCategoryPath(props.sanPham.nganhHang_SP);
            props.sanPham.nganhHang_SP = {
                cap1_NH: categoryPath.category1?._id || null,
                cap2_NH: categoryPath.category2?._id || null,
                cap3_NH: categoryPath.category3?._id || null
            };
        }
        
        updateCategoriesSelected(props.sanPham.nganhHang_SP);
    }
});

const showCategoryTable = ref(false);
defineExpose({ validateForm });
</script>
