<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step2.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step2.subtitle') }}</p>
  <img src="/images/step-2.jpg" alt="Paso 1" class="w-1/2 max-w-110 mx-auto mt-4 rounded-md" />
</template>