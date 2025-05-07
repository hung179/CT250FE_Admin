<template>
    <div class="w-full min-h-14 h-14 bg-white shadow-sm flex z-20 fixed">
        <div class="w-48 min-w-48 mt-3 mb-2 m-auto">
            <img src="../public/logo2.png" alt="" class="w-full h-full object-contain" />
        </div>
        <div class="flex-1 flex items-center justify-between">
            <div class="flex flex-1 items-center whitespace-nowrap">
               
                <NuxtLink
                    class="pl-4 text-zinc-400 hover:text-zinc-500 cursor-pointer text-base"
                    to="/"
                    >Trang chủ</NuxtLink
                >
                
                <div v-for="(item, index) in breadcrumb" :key="index">
                    <span class="mx-2 text-zinc-400"> > </span>
                    <NuxtLink
                        :to="item.path"
                        :class="[
                            item.current ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-500',
                            'cursor-pointer text-base',
                        ]"
                    >
                        {{ item.name }}
                    </NuxtLink>
                </div>
            </div>
            <div class="h-full w-fit relative ml-5 mt-4">
                <div class="relative hidden md:block">
                    <SearchBar />
                </div>
            </div>
            <div class="h-full w-fit relative ml-5 pt-2">
                <div
                    class="absolute -left-1 top-1/2 -translate-y-1/2 h-1/2 w-[1px] bg-zinc-300"
                ></div>
                <LogoutButton />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const breadcrumb = computed(() => {
    // Quản lý sản phẩm - Product
    if (route.path.includes("/product/new")) {
        return [
            { name: "Sản phẩm", path: "/product" },
            { name: "Thêm sản phẩm mới", path: route.path, current: true },
        ];
    } else if (route.path.includes("/product/detail")) {
        return [
            { name: "Sản phẩm", path: "/product" },
            { name: "Chi tiết sản phẩm", path: route.path, current: true },
        ];
    } else if (route.path.includes("/product/")) {
        return [{ name: "Sản phẩm", path: "/product", current: true }];
    }
    if(route.path.includes("/category/new")) {
        return [
            { name: "Danh mục sản phẩm", path: "/category" },
            { name: "Thêm danh mục sản phẩm mới", path: route.path, current: true },
        ];
    } else if (route.path.includes("/category/detail")) {
        return [
            { name: "Danh mục sản phẩm", path: "/category" },
            { name: "Chi tiết danh mục sản phẩm", path: route.path, current: true },
        ];
    } else if (route.path.includes("/category/")) {
        return [{ name: "Danh mục sản phẩm", path: "/category", current: true }];
    }
    if(route.path.includes("/sale")){
        return [{name: "Đơn hàng", path: "/sale", current: true}]
    }
    if(route.path.includes("/sale")){
        return [{name: "Đơn hàng", path: "/sale", current: true}]
    }
    if(route.path.includes("/search")){
        return [{name: "Tìm kiếm", path: "/search", current: true}]
    }
    if(route.path.includes("/contact/update")){
        return [{name: "Liên hệ", path: "/contact"},
            {name: "Cập nhật thông tin", path: route.path, current: true}]
    } else if(route.path.includes("/contact")){
        return [{name: "Liên hệ", path: "/contact", current: true}]
    }
    if(route.path.includes("/shipping")){
        return [{name: "Thông tin vận chuyển", path: "/shipping", current: true}]
    }
    return [];
});
</script>
