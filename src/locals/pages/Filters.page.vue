<script setup>
  import { onMounted, ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  import NavbarComponent from '@/public/components/Navbar.component.vue'
  import { LocalCategoriesApiService } from '../services/local-categories-api.service';
  import LocalCategoryCardComponent from '../components/LocalCategoryCard.component.vue';
  import { useRouter } from 'vue-router';
  import FooterComponent from '../../public/components/Footer.component.vue';
  import { SlidersHorizontal, Users, Tag, Check } from 'lucide-vue-next';

  const { t } = useI18n();

  const router = useRouter();
  const localCategories = ref([]);
  const localCategoriesApiService = new LocalCategoriesApiService();
  const localCategoryId = ref(1);
  const capacityOptionSelection = ref({ min: 1, max: 5 });
  const isLoaded = ref(false);
  const capacityOptions = computed(() => [
    { min: 1, max: 5, label: t('filtersPage.capacityOptions.intimate'), size: 16 },
    { min: 6, max: 10, label: t('filtersPage.capacityOptions.small'), size: 20 },
    { min: 11, max: 20, label: t('filtersPage.capacityOptions.medium'), size: 24 },
    { min: 21, max: 30, label: t('filtersPage.capacityOptions.large'), size: 28 },
    { min: 31, max: 50, label: t('filtersPage.capacityOptions.veryLarge'), size: 32 },
    { min: 51, max: 100, label: t('filtersPage.capacityOptions.massive'), size: 36 },
  ]);

  const selectCategory = (id) => {
    localCategoryId.value = id;
  };

  const goToFilterSearch = () => {
    router.push(`/filters-search/${localCategoryId.value}/${capacityOptionSelection.value.min}/${capacityOptionSelection.value.max}`);
  };

  onMounted(async () => {
    localCategories.value = await localCategoriesApiService.getAll();
    isLoaded.value = true;
  });

</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh]">
    <!-- Header -->
    <div class="mb-10 text-center">
      <div class="flex items-center justify-center gap-3 mb-4">
        <div class="bg-(--secondary-color) rounded-full p-3">
          <SlidersHorizontal :size="28" class="text-white" />
        </div>
      </div>
      <h1 class="text-4xl font-bold text-(--text-color) mb-2">{{ t('filtersPage.title') }}</h1>
      <p class="text-(--text-color)">{{ t('filtersPage.subtitle') }}</p>
    </div>

    <!-- Contenedor principal -->
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Categorías -->
        <div class="bg-(--background-card-color) rounded-2xl shadow-lg p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-(--primary-color) rounded-lg p-2">
              <Tag :size="24" class="text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-(--text-color)">{{ t('filtersPage.category') }}</h2>
              <p class="text-sm text-(--text-color)">{{ t('filtersPage.categorySubtitle') }}</p>
            </div>
          </div>

          <template v-if="isLoaded">
            <div class="grid grid-cols-2 gap-4">
              <LocalCategoryCardComponent
                v-for="localCategory in localCategories"
                :key="localCategory.id"
                :localCategory="localCategory"
                :isSelected="localCategory.id === localCategoryId"
                @click="selectCategory(localCategory.id)"
                class="cursor-pointer"
              />
            </div>
          </template>
          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <LocalCategoryCardComponent v-for="n in 4" :key="n" :localCategory="{}" :isLoaded="false" />
            </div>
          </template>
        </div>

        <!-- Aforo -->
        <div class="bg-(--background-card-color) rounded-2xl shadow-lg p-8">
          <div class="flex items-center gap-3 mb-6">
            <div class="bg-(--primary-color) rounded-lg p-2">
              <Users :size="24" class="text-white" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-(--text-color)">{{ t('filtersPage.capacity') }}</h2>
              <p class="text-sm text-(--text-color)">{{ t('filtersPage.capacitySubtitle') }}</p>
            </div>
          </div>

          <div class="space-y-3">
            <div
              v-for="option in capacityOptions"
              :key="option.min"
              @click="capacityOptionSelection = option"
              :class="[
                'flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md',
                capacityOptionSelection.min === option.min && capacityOptionSelection.max === option.max
                  ? 'border-(--secondary-color) bg-(--text-button-color)'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <div class="flex items-center gap-4">
                <div
                  :class="[
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    capacityOptionSelection.min === option.min && capacityOptionSelection.max === option.max
                      ? 'border-(--secondary-color) bg-(--secondary-color)'
                      : 'border-gray-400'
                  ]"
                >
                  <Check
                    v-if="capacityOptionSelection.min === option.min && capacityOptionSelection.max === option.max"
                    :size="16"
                    class="text-white"
                  />
                </div>
                <div>
                  <p class="font-semibold text-(--text-color)">{{ option.label }}</p>
                  <p class="text-sm text-(--text-color)">{{ option.min }} - {{ option.max }} {{ t('filtersPage.people') }}</p>
                </div>
              </div>
              <Users :size="option.size" class="text-(--text-color)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen y botón de aplicar -->
      <div class="mt-8 bg-(--background-card-color) rounded-2xl shadow-lg p-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-(--text-color) mb-1">{{ t('filtersPage.selectedFilters') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-(--primary-color) text-white rounded-full text-sm font-medium">
                {{ t('filtersPage.categoryLabel') }} {{ localCategories.find(c => c.id === localCategoryId)?.name || t('filtersPage.select') }}
              </span>
              <span class="px-3 py-1 bg-(--secondary-color) text-white rounded-full text-sm font-medium">
                {{ capacityOptions.find(o => o.min === capacityOptionSelection.min && o.max === capacityOptionSelection.max)?.label }}
                ({{ capacityOptionSelection.min }}-{{ capacityOptionSelection.max }} {{ t('filtersPage.people') }})
              </span>
            </div>
          </div>
          <button
            @click="goToFilterSearch"
            class="px-8 py-4 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Check :size="20" />
            {{ t('filtersPage.applyFilters') }}
          </button>
        </div>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>