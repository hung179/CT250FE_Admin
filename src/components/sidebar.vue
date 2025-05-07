<template>
    <nav class="sidebar w-48 min-w-48 bg-white h-full py-2" style="height: calc(100vh - 56px)">
        <ul>
            <li>
                <div class="w-full h-fit font-medium text-zinc-500 p-2">Quản lý sản phẩm</div>
                <NuxtLink to="/product/live">
                    <button
                        @click="active = 1"
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 1
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-400 hover:text-emerald-400'
                        "
                    >
                        Tất cả sản phẩm
                    </button>
                </NuxtLink>
                <NuxtLink to="/product/new" @click="active = 2"
                    ><button
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 2
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-400 hover:text-emerald-400'
                        "
                    >
                        Thêm mới sản phẩm
                    </button>
                </NuxtLink>
            </li>
            <li>
                <div class="w-full h-fit font-medium text-zinc-500 p-2">Quản lý danh mục</div>
                <NuxtLink to="/category/">
                    <button
                        @click="active = 3"
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 3
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-400 hover:text-emerald-400'
                        "
                    >
                        Tất cả danh mục
                    </button>
                </NuxtLink>
                <NuxtLink to="/category/new" @click="active = 4"
                    ><button
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 4
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-400 hover:text-emerald-400'
                        "
                    >
                        Thêm ngành hàng mới
                    </button>
                </NuxtLink>
            </li>
            <li>
                <NuxtLink to="/sale/">
                    <button
                        @click="active = 5"
                        class="text-left cursor-pointer py-1 font-medium w-full h-fit p-2"
                        :class="
                            active === 5
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-500 hover:text-emerald-400'
                        "
                    >
                        Quản lý đơn hàng
                    </button>
                </NuxtLink>
            </li>
            <li>                
                <div class="w-full h-fit font-medium text-zinc-500 p-2">Thông tin liên hệ</div>
                <NuxtLink to="/contact/">
                    <button
                        @click="active = 6"
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 6
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-500 hover:text-emerald-400'
                        "
                    >
                        Thông tin liên hệ
                    </button>
                </NuxtLink>
            </li>
            <li>
                <div class="w-full h-fit font-medium text-zinc-500 p-2">Quản lý vận chuyển</div>

                <NuxtLink to="/shipping/">

                    <button
                        @click="active = 8"
                        class="text-left cursor-pointer py-1 text-sm font-normal w-full h-fit pl-5"
                        :class="
                            active === 8
                                ? 'text-emerald-400 font-semibold'
                                : 'text-zinc-500 hover:text-emerald-400'
                        "
                    >
                        Thông tin vận chuyển
                    </button>
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
const active = ref(0);
</script>
<style>
.sidebar::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

/* Track scrollbar */
.sidebar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
    background: #d4d4d8;
}

.sidebar:hover::-webkit-scrollbar-thumb:hover {
    background: #9f9fa9;
}
</style>
