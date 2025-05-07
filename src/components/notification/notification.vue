<template>
    <Teleport to="body">
      <div 
        v-if="isVisible" 
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <!-- Overlay nền mờ -->
        <div 
          class="absolute inset-0 bg-black opacity-50"
          @click="closeOnBackdrop ? close() : null"
        ></div>
        
        <!-- Bảng thông báo -->
        <div 
          class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 transform transition-all duration-300"
          :class="isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'"
        >
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          </div>
          
          <!-- Nội dung -->
          <div class="px-6 py-4">
            <div v-if="typeof message === 'string'" class="text-gray-700">
              {{ message }}
            </div>
            <div v-else class="text-gray-700">
              <slot>{{ message }}</slot>
            </div>
          </div>
          
          <!-- Footer với nút OK -->
          <div class="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
            <button
              @click="close"
              class="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {{ okButtonText }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  const props = defineProps({
    title: {
      type: String,
      default: 'Thông báo'
    },
    message: {
      type: [String, Object],
      default: ''
    },
    okButtonText: {
      type: String,
      default: 'OK'
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'close']);
  
  const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  function close() {
    isVisible.value = false;
    emit('close');
  }
  
  // Đóng modal bằng phím Esc
  onMounted(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isVisible.value) {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape);
    });
  });
  </script>