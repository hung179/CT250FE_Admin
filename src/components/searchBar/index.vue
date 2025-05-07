<template>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm..."
        class="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        @keyup.enter="submitSearch"
      />
      <button @click="submitSearch" class="absolute right-2 top-2.5 text-gray-600">
        <i class="fas fa-search"></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const searchQuery = ref('');
  
  const submitSearch = () => {
    if (searchQuery.value.trim()) {
      router.push({
        path: '/search',
        query: { q: searchQuery.value }
      });
    }
  };
  </script>