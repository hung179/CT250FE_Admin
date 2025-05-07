import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const router = useRouter(); // ✅ Lấy router từ Nuxt 3
    const authStore = useAuthStore();

    const api = axios.create({
        baseURL: config.public.apiBase,
        withCredentials: true,
    });

    // 🛑 Request Interceptor: Thêm accessToken vào mỗi request
    api.interceptors.request.use(
        (config) => {
            if (authStore.accessToken) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${authStore.accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // // ⚡ Response Interceptor: Tự động refresh token nếu lỗi 401 hoặc 403
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const authStore = useAuthStore();
            if (error.response?.status === 401 || error.response?.status === 403) {
                try {
                    const res = await api.get("/auth/refresh-accesstoken", {
                        withCredentials: true,
                    });
                    const data = res.data;
                    if (data.accessToken) {
                        authStore.setAuth(data.accessToken, data.userId);
                        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
                        return api(error.config);
                    }
                } catch (refreshError) {
                    console.error("Lỗi khi refresh token:", refreshError);
                    authStore.logout();
                    router.push("/login"); // ✅ Sử dụng useRouter()
                }
            }

            return Promise.reject(error);
        }
    );

    return {
        provide: {
            api,
        },
    };
});
