<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  localName: String,
  descriptionMessage: String,
  capacity: String,
  features: Array,
});

const emit = defineEmits([
  'update:localName',
  'update:descriptionMessage',
  'update:capacity',
  'update:features'
]);

const newFeature = ref('');

// Características predefinidas comunes para locales de alquiler
const quickFeatures = [
  { icon: '📶', label: 'WiFi' },
  { icon: '🅿️', label: 'Estacionamiento' },
  { icon: '🏊', label: 'Piscina' },
  { icon: '❄️', label: 'Aire acondicionado' },
  { icon: '🍳', label: 'Cocina equipada' },
  { icon: '📺', label: 'TV/Cable' },
  { icon: '🔊', label: 'Sistema de sonido' },
  { icon: '🛡️', label: 'Seguridad 24h' },
  { icon: '🌳', label: 'Jardín' },
  { icon: '🎉', label: 'Área de eventos' },
  { icon: '🏋️', label: 'Gimnasio' },
  { icon: '🍖', label: 'Parrilla/BBQ' },
  { icon: '🛏️', label: 'Dormitorios' },
  { icon: '🚿', label: 'Baños completos' },
  { icon: '♿', label: 'Acceso para discapacitados' },
  { icon: '🐕', label: 'Pet friendly' },
];

const addFeature = () => {
  const trimmed = newFeature.value.trim();
  if (trimmed && !props.features.includes(trimmed)) {
    emit('update:features', [...props.features, trimmed]);
    newFeature.value = '';
  }
};

const addQuickFeature = (feature) => {
  const featureText = `${feature.icon} ${feature.label}`;
  if (!props.features.includes(featureText)) {
    emit('update:features', [...props.features, featureText]);
  }
};

const isFeatureSelected = (feature) => {
  const featureText = `${feature.icon} ${feature.label}`;
  return props.features.includes(featureText);
};

const removeFeature = (index) => {
  const updated = [...props.features];
  updated.splice(index, 1);
  emit('update:features', updated);
};

</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step7.title') }}</h1>
  <p class="text-lg text-center text-(--text-color)">{{ t('publishSteps.step7.subtitle') }}</p>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="localName" class="bg-(--background-color) w-22 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step7.name') }}</label>
    <input
      type="text"
      id="localName"
      :value="props.localName"
      @input="emit('update:localName', $event.target.value)"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color)"
      :placeholder="t('publishSteps.step7.namePlaceholder')"
    />
  </div>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="descriptionMessage" class="bg-(--background-color) w-30 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step7.description') }}</label>
    <textarea
      id="descriptionMessage"
      :value="props.descriptionMessage"
      @input="emit('update:descriptionMessage', $event.target.value)"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color) min-h-24 resize-y"
      :placeholder="t('publishSteps.step7.descriptionPlaceholder')"
      rows="3"
    ></textarea>
  </div>

  <div class="flex flex-col w-full max-w-140 text-(--text-color)">
    <label for="capacity" class="bg-(--background-color) w-16 text-lg font-semibold relative top-4 left-2 px-2">{{ t('publishSteps.step7.capacity') }}</label>
    <input
      type="number"
      id="capacity"
      :value="props.capacity"
      @input="emit('update:capacity', $event.target.value)"
      class="border border-gray-300 dark:border-gray-600 rounded px-4 py-4 text-(--text-color) bg-(--background-color)"
      :placeholder="t('publishSteps.step7.capacityPlaceholder')"
      min="1"
    />
  </div>

  <!-- Características -->
  <div class="flex flex-col w-full max-w-140 mt-6 text-(--text-color)">
    <label class="text-lg font-semibold mb-3">{{ t('publishSteps.step7.features') }}</label>

    <!-- Chips de características rápidas -->
    <div class="mb-4">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('publishSteps.step7.quickFeatures') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="feature in quickFeatures"
          :key="feature.label"
          @click="addQuickFeature(feature)"
          :class="[
            'px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
            isFeatureSelected(feature)
              ? 'bg-blue-500 dark:bg-blue-600 text-white border-blue-500 dark:border-blue-600'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
          :disabled="isFeatureSelected(feature)"
        >
          {{ feature.icon }} {{ feature.label }}
        </button>
      </div>
    </div>

    <!-- Input para característica personalizada -->
    <div class="flex items-center gap-2 mt-2">
      <input
        v-model="newFeature"
        @keyup.enter="addFeature"
        type="text"
        :placeholder="t('publishSteps.step7.featuresPlaceholder')"
        class="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-(--text-color) bg-(--background-color)"
      />
      <button
        @click="addFeature"
        class="px-4 py-2 rounded bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition font-medium"
      >
        {{ t('publishSteps.step7.addFeature') }}
      </button>
    </div>

    <!-- Lista de características agregadas -->
    <div v-if="props.features.length > 0" class="mt-4">
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ t('publishSteps.step7.features') }} ({{ props.features.length }})</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(feature, index) in props.features"
          :key="index"
          class="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm"
        >
          {{ feature }}
          <button
            @click="removeFeature(index)"
            class="ml-1 text-green-600 dark:text-green-400 hover:text-red-500 dark:hover:text-red-400 transition"
            :title="t('publishSteps.step7.delete')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>
  </div>
</template>
