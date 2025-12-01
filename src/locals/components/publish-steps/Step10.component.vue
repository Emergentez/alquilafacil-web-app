<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  localData: Object
});
</script>


<template>
  <template v-if="localData.localName && localData.descriptionMessage && localData.country && localData.city && localData.district && localData.street && localData.price > 0 && localData.capacity > 0 && localData.photoUrls.length > 0 && localData.features.length > 0">
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step10.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step10.subtitle') }}</p>
  <div class="flex flex-col gap-4 max-w-90 p-8 shadow-xl rounded-xl text-(--text-color) bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <img :src="localData.photoUrls[0]" alt="Imagen del local" class="rounded-lg max-w-80 object-cover">
    <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-100">{{ `${localData.district}, ${localData.city}`}} </h1>
    <h2 class="text-lg text-gray-600 dark:text-gray-400 font-medium">{{ localData.localName }}</h2>
    <p class="text-lg font-bold text-blue-600 dark:text-blue-400">S/.{{ localData.price }}{{ t('publishSteps.step10.perHour') }}</p>
  </div>
  </template>
  <template v-else>
    <div class="flex flex-col items-center gap-4 p-8">
      <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step10.errorTitle') }}</h1>
      <p class="text-lg text-center text-gray-500 dark:text-gray-400">{{ t('publishSteps.step10.errorSubtitle') }}</p>
    </div>
  </template>
</template>
