<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LocalsApiService } from '../services/locals-api.service';
import { Search, MapPin } from 'lucide-vue-next';

const { t } = useI18n();

const query = ref('');
const districts = ref([]);
const filteredDistricts = ref([]);

const localsApiService = new LocalsApiService();

const router = useRouter();

onMounted(async () => {
  try {
    districts.value = await localsApiService.getAllDistricts();
    filteredDistricts.value = districts.value;
  } catch (error) {
    console.error('Error getting districts:', error);
  }
});

watch(query, () => {
  filteredDistricts.value = districts.value.filter(district =>
    district.toLowerCase().includes(query.value.toLowerCase())
  );
  console.log(filteredDistricts.value);
});


const goToDistrict = (district) => {
  localStorage.setItem('district', district);
  router.push(`/district/${district}`);
};
</script>

<template>
  <div class="relative flex items-center justify-center w-full h-full">
    <div class="px-3 py-2 flex items-center justify-between w-full max-w-180 h-12 sm:h-14 rounded-lg border-2 border-white bg-white gap-2">
      <Search :size="20" class="text-gray-500 shrink-0" />
      <input
        v-model="query"
        type="text"
        :placeholder="t('navbar.searchPlaceholder')"
        class="w-full p-2 outline-0 text-gray-800 placeholder-gray-500"
      />
    </div>
    <ul v-if="query && filteredDistricts.length > 0"
      class="text-(--text-color) absolute top-16 sm:top-20 bg-(--background-card-color) w-full max-w-180 rounded-lg shadow-xl max-h-60 overflow-auto z-50 border-2 border-gray-200 dark:border-gray-700"
    >
      <li
        v-for="(district, index) in filteredDistricts"
        :key="index"
        @click="goToDistrict(district)"
        class="cursor-pointer px-4 py-3 hover:bg-(--text-button-color) transition-colors flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
      >
        <MapPin :size="18" class="text-(--primary-color) shrink-0" />
        <span>{{ district }}</span>
      </li>
    </ul>
  </div>
</template>
