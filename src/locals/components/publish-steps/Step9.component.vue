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
    <label for="price">S/.</label>
    <input
      type="number"
      id="price"
      :value="props.price"
      @input="emit('update:price', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4 text-right text-2xl max-w-50"
      min="1"
    />
  </div>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step9.perHour') }}</p>

</template>