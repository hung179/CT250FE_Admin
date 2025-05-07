<template>
    <div class="fixed top-0 left-0 w-full h-full z-31 bg-zinc-900/30">
        <div class="flex justify-center w-full h-full py-20">
            <div class="w-fit h-full flex flex-col overflow-hidden justify-center">
                <div
                    class="min-w-5xl w-5xl h-auto overflow-auto flex flex-col bg-zinc-50 rounded-lg"
                >
                    <div class="w-full min-h-18 h-18 p-6 flex items-center">
                        <div class="flex-1 text-base font-medium text-zinc-700">
                            Chỉnh sửa ngành hàng
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
                            <div
                                class="w-full h-fit overflow-auto flex flex-row mt-4 bg-zinc-50 rounded-md py-4"
                            >
                                <div class="flex-1 h-76 overflow-y-auto">
                                    <CategoryListForm
                                        :categories="category1"
                                        :selected="category1Selected"
                                        :parent="{ _id: null }"
                                        :key="category1"
                                        @categorySelected="handleCategory1Selected"
                                    />
                                </div>
                                <div
                                    class="flex-1 h-76 overflow-y-auto border-x-[1px] border-zinc-200"
                                >
                                    <CategoryListForm
                                        :categories="category2"
                                        :selected="category2Selected"
                                        :parent="category1Selected"
                                        :key="category2"
                                        @categorySelected="handleCategory2Selected"
                                    />
                                </div>
                                <div class="flex-1 h-76 overflow-y-auto">
                                    <CategoryListForm
                                        :categories="category3"
                                        :selected="category3Selected"
                                        :parent="category2Selected"
                                        :key="category3"
                                        @categorySelected="handleCategory3Selected"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full h-20 min-h-20 p-6 flex justify-between items-center">
                        <div class="w-fit h-full flex items-center space-x-2">
                            <span class="text-sm text-zinc-700">Đã chọn : </span>
                            <span class="text-sm text-zinc-700 font-semibold">
                                {{ category1Selected ? category1Selected.ten_NH : "" }}
                            </span>
                            <span
                                v-if="category2Selected"
                                class="text-sm text-zinc-700 font-semibold"
                            >
                                <span> > </span>
                                {{ category2Selected ? category2Selected.ten_NH : "" }}
                            </span>
                            <span
                                v-if="category3Selected"
                                class="text-sm text-zinc-700 font-semibold"
                            >
                                <span> > </span>
                                {{ category3Selected ? category3Selected.ten_NH : "" }}
                            </span>
                        </div>
                        <div class="flex h-full w-fit items-center space-x-4">
                            <button
                                @click="emit('close')"
                                class="px-4 h-full text-sm font-medium bg-zinc-50 hover:bg-zinc-100 border-[1px] border-zinc-300 text-zinc-600 rounded-md cursor-pointer"
                            >
                                <span>Hủy</span>
                            </button>
                            <button
                                @click="confirm"
                                class="px-4 h-full text-sm font-medium bg-emerald-400 hover:bg-emerald-500 text-white rounded-md cursor-pointer"
                            >
                                <span>Xác nhận</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    categoriesSelected: Object,
    categories: Array
})
const category1 = computed(() => props.categories.filter((cat) => cat.cap_NH === 1));
const category2 = computed(() => props.categories.filter((cat) => cat.cap_NH === 2));
const category3 = computed(() => props.categories.filter((cat) => cat.cap_NH === 3));

const category1Selected = ref(props.categoriesSelected?.category1 || null);
const category2Selected = ref(props.categoriesSelected?.category2 || null);
const category3Selected = ref(props.categoriesSelected?.category3 || null);

const handleCategory1Selected = (category1) => {
    category1Selected.value = category1;
};
const handleCategory2Selected = (category2) => {
    category2Selected.value = category2;
};
const handleCategory3Selected = (category3) => {
    category3Selected.value = category3;
};
const emit = defineEmits(["close", "confirm"]);

const confirm = () => {
    // Tạo đối tượng nganhHang_SP với cấu trúc phân cấp
    const categoryObject = {
        cap1_NH: category1Selected.value?._id || null,
        cap2_NH: category2Selected.value?._id || null,
        cap3_NH: category3Selected.value?._id || null
    };
    
    // Lấy danh mục thấp nhất để xác định danh mục hiển thị
    const selectedCategories = [
        category1Selected.value,
        category2Selected.value,
        category3Selected.value,
    ].filter(Boolean);

    const lowestCategory = selectedCategories.reduce(
        (lowest, current) => (current.cap_NH > (lowest?.cap_NH || 0) ? current : lowest),
        null
    );
    
    // Emit đối tượng nganhHang_SP thay vì chỉ ID
    emit("confirm", { 
        _id: lowestCategory?._id || null,
        categoryObject: categoryObject
    });
    
    emit("close");
};

watchEffect(() => {
    if (props.categoriesSelected) {
        category1Selected.value = props.categoriesSelected.category1;
        category2Selected.value = props.categoriesSelected.category2;
        category3Selected.value = props.categoriesSelected.category3;
    }
});
</script>
<style>
::-webkit-scrollbar {
    width: 6px;
}

/* Track scrollbar */
::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    background: #e4e4e7;
    border-radius: 10px;
}
</style>
