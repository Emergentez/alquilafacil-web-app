<script setup>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { LocalResponse } from '../model/local.response';
import { Star, MapPin } from 'lucide-vue-next';

const props = defineProps({
  local: Object,
  isLoaded: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();
const localResponse = new LocalResponse(props.local);

const isFavorite = ref(false);

const checkIfFavorite = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  isFavorite.value = favorites.some(fav => fav.id === localResponse.id);
};

watchEffect(() => {
  checkIfFavorite();
});

const goToLocal = () => {
  router.push(`/local/${props.local.id}`);
};

const addToFavorites = async () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const existingIndex = favorites.findIndex(fav => fav.id === localResponse.id);

  if (existingIndex !== -1) {
    favorites.splice(existingIndex, 1);
    isFavorite.value = false;
  } else {
    favorites.push(localResponse);
    isFavorite.value = true;
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
};
</script>

<template>
  <div v-if="isLoaded"
    class="flex flex-col shadow-lg rounded-lg hover:shadow-xl transition duration-300 ease-in-out hover:cursor-pointer bg-(--background-card-color)"
    @click="goToLocal"
  >
    <img :src="localResponse.photoUrls[0]" alt="Local Image" class="w-full h-60 object-cover rounded-t-lg" />
    <div class="p-4 rounded-b-lg flex justify-between items-start">
      <div class="flex flex-col gap-2 flex-1">
        <h2 class="text-xl font-semibold text-(--text-color)">{{ localResponse.localName }}</h2>
        <div class="flex items-center gap-2">
          <MapPin :size="16" class="text-(--primary-color) shrink-0" />
          <p class="text-sm text-(--text-color) line-clamp-1">{{ localResponse.address }}</p>
        </div>
      </div>
      <button
        @click.stop="addToFavorites"
        class="rounded-full p-2 flex justify-center items-center hover:cursor-pointer transition-all hover:scale-110"
        :class="isFavorite ? 'bg-(--secondary-color)' : 'bg-gray-200 dark:bg-gray-700'"
      >
        <Star
          :size="24"
          :fill="isFavorite ? 'white' : 'none'"
          :class="isFavorite ? 'text-white' : 'text-gray-600 dark:text-gray-300'"
        />
      </button>
    </div>
  </div>
  <div v-else class="flex flex-col gap-4 shadow-lg rounded-lg p-4 animate-pulse bg-(--background-card-color)">
    <div class="w-full h-48 skeleton rounded-lg"></div>
    <div class="h-6 skeleton rounded w-3/4"></div>
    <div class="h-4 skeleton rounded w-full"></div>
    <div class="h-4 bg-skeleton rounded w-5/6"></div>
  </div>
</template>
