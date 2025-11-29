<script setup>
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import NavbarComponent from '@/public/components/Navbar.component.vue'
  import LocalCardComponent from '../components/LocalCard.component.vue';
  import { LocalsApiService } from '../services/locals-api.service';
  import { useRouter } from 'vue-router';
  import FooterComponent from '../../public/components/Footer.component.vue';
  import { Search, MapPin, SlidersHorizontal } from 'lucide-vue-next';

  const { t } = useI18n();

  const locals = ref([]);
  const localsApiService = new LocalsApiService();
  const router = useRouter();
  const isLoaded = ref(false);
  const searchedDistrict = ref('');

  onMounted(async () => {
    locals.value = await localsApiService.getAll();
    const district = localStorage.getItem('district');
    searchedDistrict.value = district || t('districtSearch.title');

    if (district) {
      const normalize = (str) =>
        str
          .toLowerCase()
          .split(',')
          .map(s => s.trim());

      const districtParts = normalize(district);

      locals.value = locals.value.filter(local => {
        const cityParts = normalize(`${local.address}`);
        return districtParts.every(part => cityParts.includes(part));
      });
    }
    isLoaded.value = true;
  });

  const goToFilters = () => {
    router.push('/filters');
  };
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-amber-500 rounded-full p-3">
          <Search :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-800">{{ t('districtSearch.title') }}</h1>
      </div>

      <!-- Panel de filtros aplicados -->
      <div class="bg-white rounded-2xl shadow-md p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Filtros activos -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-medium text-gray-600">{{ t('districtSearch.searchByLocation') }}</p>
            <div class="flex flex-wrap gap-2">
              <div class="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full">
                <MapPin :size="16" />
                <span class="font-medium">{{ searchedDistrict }}</span>
              </div>
            </div>
          </div>

          <!-- Estadísticas y botón -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
              <MapPin :size="20" class="text-emerald-600" />
              <div>
                <p class="text-2xl font-bold text-gray-800">{{ locals.length }}</p>
                <p class="text-xs text-gray-600">{{ t('districtSearch.spacesFound') }}</p>
              </div>
            </div>
            <button
              @click="goToFilters"
              class="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <SlidersHorizontal :size="18" />
              {{ t('districtSearch.advancedFilters') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <template v-if="isLoaded">
      <div v-if="locals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <LocalCardComponent v-for="local in locals" :key="local.id" :local="local" />
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20 gap-4">
        <Search :size="64" class="text-gray-400" />
        <h2 class="text-2xl font-semibold text-gray-700">{{ t('districtSearch.noSpacesFound') }}</h2>
        <p class="text-gray-500">{{ t('districtSearch.noSpacesInDistrict') }} "{{ searchedDistrict }}"</p>
        <button
          @click="goToFilters"
          class="mt-4 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
        >
          <SlidersHorizontal :size="18" />
          {{ t('districtSearch.searchWithFilters') }}
        </button>
      </div>
    </template>
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <LocalCardComponent v-for="n in 8" :key="n" :local="{}" :isLoaded="false" />
      </div>
    </template>
  </main>
  <FooterComponent />
</template>
