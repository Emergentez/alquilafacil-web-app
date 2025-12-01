<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  price: String,
});

const emit = defineEmits([
  'update:price',
]);
</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step9.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step9.subtitle') }}</p>
  <div class="flex justify-center items-center gap-4 w-full max-w-120 text-(--text-color)">
    <label for="price" class="text-3xl font-bold">S/.</label>
    <input
      type="number"
      id="price"
      :value="props.price"
      @input="emit('update:price', $event.target.value)"
      class="border border-gray-300 rounded-lg px-4 py-4 text-right text-3xl max-w-50 bg-(--background-color) text-(--text-color)"
      min="1"
    />
  </div>
  <p class="text-lg text-center text-(--text-color) opacity-70">{{ t('publishSteps.step9.perHour') }}</p>

</template>
