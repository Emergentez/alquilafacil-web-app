<script setup>
  import { onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  import NavbarComponent from '@/public/components/Navbar.component.vue'
  import FooterComponent from '../../public/components/Footer.component.vue';
  import LocalCardComponent from '../components/LocalCard.component.vue';
  import { LocalsApiService } from '../services/locals-api.service';
  import { useRouter } from 'vue-router';
  import { Search, SlidersHorizontal, MapPin, Grid, List } from 'lucide-vue-next';

  const { t } = useI18n();

  const locals = ref([]);
  const localsApiService = new LocalsApiService();
  const router = useRouter();
  const isLoaded = ref(false);
  const viewMode = ref('grid'); // 'grid' or 'list'

  onMounted(async() => {
    locals.value = await localsApiService.getAll();
    isLoaded.value = true;
  });

  const goToFilters = () => {
    router.push('/filters');
  };
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh]">
    <!-- Header mejorado -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-4xl font-bold text-(--text-color) mb-2">{{ t('searchPage.title') }}</h1>
          <p class="text-(--text-color) flex items-center gap-2">
            <MapPin :size="16" />
            {{ t('searchPage.subtitle') }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Toggle de vista -->
          <div class="bg-(--background-card-color) rounded-lg p-1 shadow-sm flex gap-1">
            <button
              @click="viewMode = 'grid'"
              :class="viewMode === 'grid' ? 'bg-(--text-button-color)' : 'hover:bg-(--text-button-color)'"
              class="p-2 rounded transition-colors cursor-pointer"
            >
              <Grid :size="20" :class="viewMode === 'grid' ? 'text-(--text-color)' : 'text-gray-500'" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="viewMode === 'list' ? 'bg-(--text-button-color)' : 'hover:bg-(--text-button-color)'"
              class="p-2 rounded transition-colors cursor-pointer"
            >
              <List :size="20" :class="viewMode === 'list' ? 'text-(--text-color)' : 'text-gray-500'" />
            </button>
          </div>
        </div>
      </div>

      <!-- Panel de estadísticas y acciones -->
      <div class="bg-(--background-card-color) rounded-2xl shadow-md p-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Estadísticas -->
          <div class="flex items-center gap-3">
            <div class="bg-(--secondary-color) rounded-full p-3">
              <MapPin :size="24" class="text-white" />
            </div>
            <div>
              <p class="text-2xl font-bold text-(--text-color)">{{ locals.length }}</p>
              <p class="text-sm text-(--text-color)">{{ t('searchPage.availableSpaces') }}</p>
            </div>
          </div>

          <!-- Botón de filtros -->
          <button
            @click="goToFilters"
            class="w-full sm:w-auto px-8 py-3 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal :size="20" />
            {{ t('searchPage.advancedFilters') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Resultados -->
    <template v-if="isLoaded">
      <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' : 'flex flex-col gap-4'">
        <LocalCardComponent v-for="local in locals" :key="local.id" :local="local" />
      </div>
    </template>

    <!-- Loading skeleton -->
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <LocalCardComponent v-for="n in 8" :key="n" :local="{}" :isLoaded="false" />
      </div>
    </template>
  </main>
  <FooterComponent />
</template>