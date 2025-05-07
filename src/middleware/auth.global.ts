export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
  
    if (!authStore.accessToken && !(to.path === '/login')) {
        return navigateTo("/login");
    }
  });
  