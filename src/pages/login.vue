<template>
        <div
            class="flex flex-row flex-1 rounded-xl shadow-xl bg-white/10 backdrop-blur-md m-5 sm:m-20"
        >
            <div class="flex flex-1 justify-center items-center py-10">
                <div class="w-full h-full lg:flex hidden justify-center items-center">
                    <!-- <img src="../public/logo1.png" alt="" class="h-full object-contain" /> -->
                </div>
            </div>
            <div class="max-w-xl w-full min-w-sm h-full min-h-fit bg-white rounded-xl py-15 px-10">
                <div class="w-full h-full min-h-fit flex flex-col justify-center">
                    <h2 class="font-semibold text-3xl text-center text-emerald-400 pb-5">
                        ĐĂNG NHẬP
                    </h2>
                    <form @submit.prevent="login">
                        <div class="my-5">
                            <label class="block mb-2">Email</label>
                            <input
                                v-model="email_NS"
                                type="text"
                                required
                                placeholder="Nhập email"
                                class="w-full p-3 rounded-lg bg-zinc-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <div class="mb-4">
                            <label class="block mb-2">Mật khẩu</label>
                            <input
                                v-model="mk_NS"
                                type="password"
                                required
                                placeholder="Nhập mật khẩu"
                                class="w-full p-3 rounded-lg bg-zinc-100 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                        </div>

                        <button
                            type="submit"
                            class="w-full bg-emerald-400 hover:bg-emerald-500 font-semibold p-3 rounded-lg transition mt-8 cursor-pointer"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </div>
</template>

<script setup>
const router = useRouter();

definePageMeta({
    layout: "login",
});

const mk_NS =  ref('');
const email_NS =  ref('');

const authStore = useAuthStore();
const { $api } = useNuxtApp(); // ✅ Truy cập api từ plugin

// 🛠 Gọi API đăng nhập
async function login() {
    try { 
        const res = await $api.post("/auth/admin-login", {
            username_NS: email_NS.value,
            mk_NS: mk_NS.value,
        },
    );
        const data = res.data;
        if (data.accessToken && data.userId) {
            authStore.setAuth(data.accessToken, data.userId); // ✅ Lưu vào Pinia store
            router.push('/')
        }   
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
    }
}
</script>
