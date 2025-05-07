<template>
    <div class="relative w-full">
        <div class="relative">
            <div class="font-medium text-xl mb-5">Tìm kiếm thông tin vận chuyển</div>

            <input
                v-model="searchQuery"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Tìm kiếm tỉnh thành"
                @focus="showSuggestions = true"
                @blur="hideSuggestions"
                @input="debouncedSearch"
            />
            <div v-if="loading" class="absolute right-3 top-2">
                <div
                    class="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
                ></div>
            </div>
        </div>

        <div
            v-if="showSuggestions && searchings.length > 0"
            class="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 max-h-64 overflow-y-auto"
        >
            <ul>
                <li
                    v-for="(searching, index) in searchings"
                    :key="index"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer transition duration-150"
                    @mousedown.prevent="selectSuggestion(searching)"
                >
                    {{ searching.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import useInformationService from "../../service/shippingInformation.service";
const informationService = useInformationService();
const emit = defineEmits(["selected"]);

// State
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const loading = ref(false);
let debounceTimeout = null;
const searchings = ref("");
onMounted(async () => {
    const result = await fetch("https://provinces.open-api.vn/api/p/");
    const provinceCode = await result.json();
    const response = await informationService.getAllInformation();
    if (response.success && result.ok) {
        suggestions.value = findProvince(response.data, provinceCode);
        searchings.value = suggestions.value;
    }
});

// Trong component tìm kiếm
const xoaTimKiem = () => {
  searchQuery.value = "";
};

// Cung cấp phương thức này cho component cha
defineExpose({ xoaTimKiem });

// Methods 
const debouncedSearch = () => {
    clearTimeout(debounceTimeout);

    loading.value = true;

    debounceTimeout = setTimeout(() => {
        fetchSuggestions();
    }, 300);
    fetchSuggestions();
};

const fetchSuggestions = async () => {
    showSuggestions.value = true;
    loading.value = false;
};

const selectSuggestion = (suggestion) => {
    searchQuery.value = suggestion.name;
    showSuggestions.value = false;
    emit("selected", suggestion);
};

const hideSuggestions = () => {
    // Delay hiding to allow for clicks on suggestions
    setTimeout(() => {
        showSuggestions.value = false;
    }, 200);
};

// Watch for immediate changes
watch(searchQuery, async (newValue) => {
    const result = suggestions.value.filter((element) => {
        return element.name.includes(newValue);
    });
    searchings.value = result;
});

const findProvince = (arr1, arr2) => {
    const province = arr1.map((element) => {
        const result = arr2.find((index) => {
            return index.name == element.tinh_VC;
        });
        const { name } = result;
        return { name, ...element };
    });
    return province;
};

</script>
