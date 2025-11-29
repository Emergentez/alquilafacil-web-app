<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { LocalsApiService } from '../../locals/services/locals-api.service';
import { MapPin, DollarSign, Eye, Activity, Home } from 'lucide-vue-next';

const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const localsApiService = new LocalsApiService();

const locals = ref([]);

onMounted(async () => {
  try {
    const userId = authenticationStore.userId;
    const response = await localsApiService.getUserLocals(userId);
    locals.value = response;
  } catch (error) {
    console.error('Error fetching published spaces:', error);
  }
});

</script>

<template>
  <div v-if="locals" class="w-full p-4 flex flex-col gap-10">
    <h2 class="text-xl md:text-4xl font-bold text-center mb-6 text-(--text-color)">
      {{ t('publishedSpaces.title') }}
    </h2>
    <div class="w-full flex justify-center items-center">
      <div v-if="locals.length === 0" class="w-full flex flex-col items-center justify-center gap-4 py-10">
        <Home :size="64" class="text-gray-400" />
        <p class="text-lg text-center text-(--text-color)">{{ t('publishedSpaces.noSpaces') }}</p>
      </div>
    </div>
    <div v-for="local in locals" :key="local.id" class="w-full px-6 py-6 text-(--text-color) bg-(--background-card-color) shadow-lg rounded-xl flex items-center justify-between transition-all hover:shadow-xl">
      <div class="flex flex-col xl:flex-row gap-6 w-full items-center">
        <img :src="local.photoUrls[0]" alt="Local Image" class="w-full xl:w-40 h-40 object-cover rounded-xl shadow-md" />
        <div class="flex flex-col justify-center gap-3 w-full">
          <h3 class="text-2xl font-bold">{{ local.localName }}</h3>
          <div class="flex items-center gap-2 text-lg">
            <MapPin :size="20" class="text-(--primary-color)" />
            <p>{{ local.address }}</p>
          </div>
          <div class="flex items-center gap-2 text-lg">
            <DollarSign :size="20" class="text-(--secondary-color)" />
            <p class="font-semibold">S/. {{ local.price }} {{ t('publishedSpaces.perHour') }}</p>
          </div>
        </div>
        <div class="w-full xl:w-auto flex flex-col items-stretch xl:items-center justify-center gap-3">
          <RouterLink :to="`/local/${local.id}`" class="px-6 py-3 bg-(--primary-color) hover:bg-(--primary-color-hover) text-white text-center rounded-lg hover:cursor-pointer transition-colors flex items-center justify-center gap-2 font-semibold">
            <Eye :size="20" />
            {{ t('publishedSpaces.viewDetails') }}
          </RouterLink>
          <RouterLink :to="`/monitoring/${local.id}`" class="px-6 py-3 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white text-center rounded-lg hover:cursor-pointer transition-colors flex items-center justify-center gap-2 font-semibold">
            <Activity :size="20" />
            {{ t('publishedSpaces.monitor') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

