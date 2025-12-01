<script setup>
const props = defineProps({
  localCategory: Object,
  isSelected: Boolean,
  isLoaded: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <div v-if="isLoaded"
    class="flex flex-col p-4 gap-6 rounded-lg shadow-lg border-4 hover:cursor-pointer transition-all bg-white dark:bg-gray-800 hover:shadow-xl"
    :class="isSelected ? 'border-blue-500 dark:border-blue-400' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'"
  >
    <img
      :src="localCategory.photoUrl"
      alt="Local Category Image"
      class="w-80 h-40 object-contain rounded-lg mx-auto"
    />
    <p class="text-center text-xl text-gray-800 dark:text-gray-200 font-medium">
      {{ localCategory.name }}
    </p>
  </div>
  <div v-else class="flex flex-col p-4 gap-6 rounded-lg shadow-lg border-4 border-transparent bg-white dark:bg-gray-800">
    <div class="skeleton w-80 max-w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    <p class="skeleton text-center text-xl w-3/4 mx-auto h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></p>
  </div>
</template>
