<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import LocalCardComponent from '../../locals/components/LocalCard.component.vue';
import { ref } from 'vue';
import { Heart } from 'lucide-vue-next';

const { t } = useI18n();
const favorites = ref([]);

onMounted(() => {
  favorites.value = JSON.parse(localStorage.getItem('favorites')) || [];
});

</script>

<template>
  <h2 class="text-xl md:text-2xl font-semibold text-center mb-6 text-(--text-color)">
      {{ t('favorites.subtitle') }}
  </h2>
  <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <LocalCardComponent
      v-for="local in favorites"
      :key="local.id"
      :local="local"
    />
  </div>
  <div v-else class="w-full flex flex-col items-center justify-center gap-4 py-10">
    <Heart :size="64" class="text-gray-400" />
    <p class="text-lg text-(--text-color)">{{ t('favorites.noFavorites') }}</p>
  </div>
</template>