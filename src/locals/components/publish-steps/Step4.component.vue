<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  country: String,
  city: String,
  district: String,
  street: String,
});

const emit = defineEmits([
  'update:country',
  'update:city',
  'update:district',
  'update:street'
]);

</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step4.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step4.subtitle') }}</p>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="country" class="bg-(--background-color) w-12 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.country') }}</label>
    <input
      type="text"
      id="country"
      :value="props.country"
      @input="emit('update:country', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4 text-(--text-color)"
      :placeholder="t('publishSteps.step4.countryPlaceholder')"
    />
  </div>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="city" class="bg-(--background-color) w-33 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.department') }}</label>
    <input
      type="text"
      id="city"
      :value="props.city"
      @input="emit('update:city', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4 text-(--text-color)"
      :placeholder="t('publishSteps.step4.departmentPlaceholder')"
    />
  </div>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="district" class="bg-(--background-color) w-19 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.district') }}</label>
    <input
      type="text"
      id="district"
      :value="props.district"
      @input="emit('update:district', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4 text-(--text-color)"
      :placeholder="t('publishSteps.step4.districtPlaceholder')"
    />
  </div>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="street" class="bg-(--background-color) w-23 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step4.address') }}</label>
    <input
      type="text"
      id="street"
      :value="props.street"
      @input="emit('update:street', $event.target.value)"
      class="border border-gray-300 rounded px-4 py-4 text-(--text-color)"
      :placeholder="t('publishSteps.step4.addressPlaceholder')"
    />
  </div>
</template>