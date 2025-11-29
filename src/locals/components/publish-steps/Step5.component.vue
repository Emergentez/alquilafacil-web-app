<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step5.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step5.subtitle') }}</p>
  <img src="/images/step-5.png" alt="Paso 2" class="w-1/2 max-w-110 mx-auto mt-4" />
</template>