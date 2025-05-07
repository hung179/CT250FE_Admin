// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    srcDir: "src/",
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["~/assets/css/main.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    modules: ["@pinia/nuxt", "@nuxt/icon"],
    runtimeConfig: {
        public: {
            apiBase: "http://localhost:3999", // Địa chỉ API backend
        },
    },
    devServer: {
        host: '0.0.0.0',
        port: 3001,
    },
});
