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
  <div class="flex flex-col gap-4 max-w-90 p-8 shadow-2xl text-(--text-color)">
    <img :src="localData.photoUrls[0]" alt="Imagen del local" class="rounded-md max-w-80">
    <h1 class="text-xl font-semibold">{{ `${localData.district}, ${localData.city}`}} </h1>
    <h2 class="text-lg text-gray-600 font-medium">{{ localData.localName }}</h2>
    <p class="text-lg">S/.{{ localData.price }}{{ t('publishSteps.step10.perHour') }}</p>
  </div>
  </template>
  <template v-else>
    <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step10.errorTitle') }}</h1>
    <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step10.errorSubtitle') }}</p>
  </template>
</template>