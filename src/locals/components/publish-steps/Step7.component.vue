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
  'WiFi', 'Estacionamiento', 'Piscina', 'Aire acondicionado',
  'Cocina equipada', 'TV/Cable', 'Sistema de sonido', 'Seguridad 24h',
  'Jardín', 'Área de eventos', 'Gimnasio', 'Parrilla/BBQ',
  'Dormitorios', 'Baños completos', 'Accesibilidad', 'Pet friendly'
];

const addFeature = () => {
  const trimmed = newFeature.value.trim();
  if (trimmed && !props.features.includes(trimmed)) {
    emit('update:features', [...props.features, trimmed]);
    newFeature.value = '';
  }
};

const addQuickFeature = (feature) => {
  if (!props.features.includes(feature)) {
    emit('update:features', [...props.features, feature]);
  }
};

const isFeatureSelected = (feature) => {
  return props.features.includes(feature);
};

const removeFeature = (index) => {
  const updated = [...props.features];
  updated.splice(index, 1);
  emit('update:features', updated);
};

</script>

<template>
  <h1 class="text-3xl text-center font-semibold text-(--text-color)">{{ t('publishSteps.step7.title') }}</h1>
  <p class="text-lg text-center text-(--text-color) opacity-70">{{ t('publishSteps.step7.subtitle') }}</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-160 mt-4">
    <!-- Nombre -->
    <div class="flex flex-col text-(--text-color)">
      <label for="localName" class="text-sm font-semibold mb-2 opacity-80">{{ t('publishSteps.step7.name') }}</label>
      <input
        type="text"
        id="localName"
        :value="props.localName"
        @input="emit('update:localName', $event.target.value)"
        class="border border-gray-300 rounded-lg px-4 py-3 text-(--text-color) bg-(--background-color)"
        :placeholder="t('publishSteps.step7.namePlaceholder')"
      />
    </div>

    <!-- Aforo -->
    <div class="flex flex-col text-(--text-color)">
      <label for="capacity" class="text-sm font-semibold mb-2 opacity-80">{{ t('publishSteps.step7.capacity') }}</label>
      <input
        type="number"
        id="capacity"
        :value="props.capacity"
        @input="emit('update:capacity', $event.target.value)"
        class="border border-gray-300 rounded-lg px-4 py-3 text-(--text-color) bg-(--background-color)"
        :placeholder="t('publishSteps.step7.capacityPlaceholder')"
        min="1"
      />
    </div>

    <!-- Descripción - ocupa todo el ancho -->
    <div class="flex flex-col text-(--text-color) md:col-span-2">
      <label for="descriptionMessage" class="text-sm font-semibold mb-2 opacity-80">{{ t('publishSteps.step7.description') }}</label>
      <textarea
        id="descriptionMessage"
        :value="props.descriptionMessage"
        @input="emit('update:descriptionMessage', $event.target.value)"
        class="border border-gray-300 rounded-lg px-4 py-3 text-(--text-color) bg-(--background-color) min-h-24 resize-y"
        :placeholder="t('publishSteps.step7.descriptionPlaceholder')"
        rows="3"
      ></textarea>
    </div>
  </div>

  <!-- Características -->
  <div class="flex flex-col w-full max-w-160 mt-6 text-(--text-color)">
    <label class="text-sm font-semibold mb-3 opacity-80">{{ t('publishSteps.step7.features') }}</label>

    <!-- Chips de características rápidas -->
    <div class="mb-4">
      <p class="text-xs opacity-60 mb-2">{{ t('publishSteps.step7.quickFeatures') }}</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="feature in quickFeatures"
          :key="feature"
          @click="addQuickFeature(feature)"
          :class="[
            'px-3 py-1.5 rounded-full text-sm transition-all border',
            isFeatureSelected(feature)
              ? 'bg-(--primary-color) text-white border-(--primary-color)'
              : 'bg-(--background-card-color) text-(--text-color) border-gray-300 hover:border-(--secondary-color)'
          ]"
          :disabled="isFeatureSelected(feature)"
        >
          {{ feature }}
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
        class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-(--text-color) bg-(--background-color)"
      />
      <button
        @click="addFeature"
        class="px-4 py-2 rounded-lg bg-(--secondary-color) text-white hover:bg-(--secondary-color-hover) transition font-medium"
      >
        +
      </button>
    </div>

    <!-- Lista de características agregadas -->
    <ul v-if="props.features.length > 0" class="mt-4 space-y-2">
      <li
        v-for="(feature, index) in props.features"
        :key="index"
        class="flex items-center justify-between border-b border-gray-200 pb-2"
      >
        <span>• {{ feature }}</span>
        <button
          @click="removeFeature(index)"
          class="text-(--primary-color) hover:opacity-70 text-sm"
          :title="t('publishSteps.step7.delete')"
        >
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>
