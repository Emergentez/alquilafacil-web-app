<script setup>
import { cloudinaryWidget } from '../../../shared/components/cloudinary-widget';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  photoUrls: Array,
});

const emit = defineEmits([
  'update:photoUrls',
]);


const openUploadWidget = async () => {
  try {
    const urls = await cloudinaryWidget();
    console.log("Imágenes subidas:", urls);
    emit('update:photoUrls', urls);
  } catch (error) {
    console.error("Error al subir imágenes:", error);
  }
};

</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step6.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step6.subtitle') }}</p>
  <button @click="openUploadWidget" class="flex flex-col p-10 shadow-2xl hover:cursor-pointer">
    <img src="/svgs/camera.svg" alt="camera" class="w-1/2 max-w-110 mx-auto mt-4" />
    <span class="text-center text-(--text-color) text-2xl ">{{ t('publishSteps.step6.addImage') }}</span>
  </button>
  <div v-if="photoUrls.length > 0" class="flex flex-col items-center gap-2 w-full mt-4 text-(--text-color)">
    <h2 class="text-2xl">{{ t('publishSteps.step6.selectedImages') }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
      <img
        v-for="(url, index) in photoUrls"
        :key="index"
        :src="url"
        class="w-full h-32 object-fill rounded-lg shadow-md"
      />
    </div>
  </div>
</template>