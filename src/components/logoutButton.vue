<template>
    <div>
        <button @click="logout" class="w-36 h-full py-2 text-md hover:bg-zinc-200 cursor-pointer">
            Đăng xuất
        </button>
        <Notification v-model="showModal" title="Thông báo" message="Đăng xuất thành công" @close="router.push('/login')"/>
    </div>
</template>

<script setup>
const authStore = useAuthStore();
const { $api } = useNuxtApp();
const showModal = ref(false);
const router = useRouter();
async function logout() {
    try {
        const res = await $api.get("/auth/logout", {});
        authStore.logout();
        showModal.value = true;
    } catch (error) {
        console.error("Lỗi đăng xuất:", error);
    }
}
</script>