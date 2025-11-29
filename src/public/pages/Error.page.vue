<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import NavbarComponent from '../components/Navbar.component.vue';
import FooterComponent from '../components/Footer.component.vue';
import { useRouter } from 'vue-router';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<template>
<NavbarComponent />
<main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] flex flex-col items-center justify-center gap-6">
  <div class="max-w-2xl w-full bg-(--background-card-color) shadow-lg rounded-xl p-8 flex flex-col items-center gap-6">
    <div class="bg-red-100 rounded-full p-6">
      <AlertTriangle :size="64" class="text-red-500" />
    </div>

    <h1 class="text-4xl font-bold text-(--text-color) text-center">{{ t('errors.somethingWrong') }}</h1>

    <p class="text-lg text-(--text-color) text-center">
      {{ t('errors.unexpectedError') }}
    </p>

    <div class="flex flex-col sm:flex-row gap-4 mt-4 w-full">
      <button
        @click="goBack"
        class="flex-1 bg-(--background-card-color) text-(--text-color) rounded-lg px-6 py-3 text-lg font-semibold border-2 border-(--primary-color) hover:border-(--primary-color-hover) hover:cursor-pointer transition-colors flex items-center justify-center gap-2"
      >
        <ArrowLeft :size="20" />
        {{ t('errors.goBack') }}
      </button>
      <button
        @click="goHome"
        class="flex-1 bg-(--primary-color) text-white rounded-lg px-6 py-3 text-lg font-semibold hover:bg-(--primary-color-hover) hover:cursor-pointer transition-colors flex items-center justify-center gap-2"
      >
        <Home :size="20" />
        {{ t('errors.goHome') }}
      </button>
    </div>
  </div>
</main>
<FooterComponent />
</template>
