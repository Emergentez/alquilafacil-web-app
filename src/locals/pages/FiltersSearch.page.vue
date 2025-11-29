<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  import NavbarComponent from '@/public/components/Navbar.component.vue'
  import LocalCardComponent from '../components/LocalCard.component.vue';
  import { LocalsApiService } from '../services/locals-api.service';
  import { LocalCategoriesApiService } from '../services/local-categories-api.service';
  import { useRoute, useRouter } from 'vue-router';
  import FooterComponent from '../../public/components/Footer.component.vue';
  import { Search, Tag, Users, MapPin } from 'lucide-vue-next';

  const { t } = useI18n();

  const locals = ref([]);
  const localsApiService = new LocalsApiService();
  const localCategoriesApiService = new LocalCategoriesApiService();
  const route = useRoute();
  const router = useRouter();
  const isLoaded = ref(false);
  const categoryName = ref('');

  const capacityOptions = computed(() => [
    { min: 1, max: 5, label: t('filtersPage.capacityOptions.intimate') },
    { min: 6, max: 10, label: t('filtersPage.capacityOptions.small') },
    { min: 11, max: 20, label: t('filtersPage.capacityOptions.medium') },
    { min: 21, max: 30, label: t('filtersPage.capacityOptions.large') },
    { min: 31, max: 50, label: t('filtersPage.capacityOptions.veryLarge') },
    { min: 51, max: 100, label: t('filtersPage.capacityOptions.massive') },
  ]);

  const capacityLabel = computed(() => {
    const minCapacity = parseInt(route.params.minCapacity);
    const maxCapacity = parseInt(route.params.maxCapacity);
    const option = capacityOptions.value.find(o => o.min === minCapacity && o.max === maxCapacity);
    return option ? option.label : `${minCapacity}-${maxCapacity} ${t('filtersPage.people')}`;
  });

  onMounted(async () => {
    const localCategoryId = parseInt(route.params.localCategoryId);
    const minCapacity = parseInt(route.params.minCapacity);
    const maxCapacity = parseInt(route.params.maxCapacity);

    const categories = await localCategoriesApiService.getAll();
    const category = categories.find(c => c.id === localCategoryId);
    categoryName.value = category?.name || t('filtersSearchPage.categoryNotFound');

    locals.value = await localsApiService.getByCategoryAndCapacityRange(localCategoryId, minCapacity, maxCapacity);
    isLoaded.value = true;
  });

  const goBackToFilters = () => {
    router.push('/filters');
  };

</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh]">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-(--secondary-color) rounded-full p-3">
          <Search :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('filtersSearchPage.title') }}</h1>
      </div>

      <!-- Panel de filtros aplicados -->
      <div class="bg-(--background-card-color) rounded-2xl shadow-md p-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <!-- Filtros activos -->
          <div class="flex flex-col gap-3">
            <p class="text-sm font-medium text-(--text-color)">{{ t('filtersSearchPage.appliedFilters') }}</p>
            <div class="flex flex-wrap gap-2">
              <div class="flex items-center gap-2 px-4 py-2 bg-(--primary-color) text-white rounded-full">
                <Tag :size="16" />
                <span class="font-medium">{{ categoryName }}</span>
              </div>
              <div class="flex items-center gap-2 px-4 py-2 bg-(--secondary-color) text-white rounded-full">
                <Users :size="16" />
                <span class="font-medium">{{ capacityLabel }}</span>
              </div>
            </div>
          </div>

          <!-- Estadísticas y botón -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div class="flex items-center gap-2 bg-(--text-button-color) px-4 py-2 rounded-lg">
              <MapPin :size="20" class="text-(--text-color)" />
              <div>
                <p class="text-2xl font-bold text-(--text-color)">{{ locals.length }}</p>
                <p class="text-xs text-(--text-color)">{{ t('filtersSearchPage.spacesFound') }}</p>
              </div>
            </div>
            <button
              @click="goBackToFilters"
              class="px-6 py-2.5 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              {{ t('filtersSearchPage.modifyFilters') }}
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
        <h2 class="text-2xl font-semibold text-(--text-color)">{{ t('filtersSearchPage.noSpacesFound') }}</h2>
        <p class="text-(--text-color)">{{ t('filtersSearchPage.tryAdjustFilters') }}</p>
        <button
          @click="goBackToFilters"
          class="mt-4 px-8 py-3 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          {{ t('filtersSearchPage.changeFilters') }}
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