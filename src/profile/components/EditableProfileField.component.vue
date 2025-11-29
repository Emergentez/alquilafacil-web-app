<script setup>
import { ref, watch } from 'vue';
import { Edit2, Check, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  label: String,
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);

const editing = ref(false);
const localValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal;
});

const toggleEdit = () => {
  if (editing.value) {
    emit('update:modelValue', localValue.value);
  }
  editing.value = !editing.value;
};

const cancelEdit = () => {
  localValue.value = props.modelValue;
  editing.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-1.5 border-b border-(--text-button-color) pb-3 col-span-1 md:col-span-2 lg:col-span-1">
    <label class="text-xs font-semibold text-(--text-color) uppercase tracking-wide">{{ label }}</label>

    <div v-if="!editing" class="flex justify-between items-center gap-2">
      <p class="text-(--text-color) text-sm md:text-base">{{ modelValue || '—' }}</p>
      <button
        type="button"
        class="bg-(--text-button-color) hover:bg-(--button-color-hover) text-(--text-color) px-2.5 py-1.5 rounded-lg hover:cursor-pointer transition-colors flex items-center gap-1.5"
        @click="toggleEdit"
      >
        <Edit2 :size="14" />
        <span class="hidden sm:inline text-sm">{{ t('editableField.edit') }}</span>
      </button>
    </div>

    <div v-else class="flex flex-col gap-1.5">
      <input
        type="text"
        v-model="localValue"
        class="border-2 border-(--primary-color) rounded-lg p-2 w-full text-(--text-color) bg-(--background-card-color) focus:outline-none focus:border-(--secondary-color) text-sm"
        :placeholder="t('common.editPlaceholder') + ' ' + label"
      />
      <div class="flex gap-1.5">
        <button
          type="button"
          class="flex-1 bg-(--secondary-color) hover:bg-(--secondary-color-hover) text-white px-3 py-1.5 rounded-lg hover:cursor-pointer transition-colors flex items-center justify-center gap-1.5 font-semibold text-sm"
          @click="toggleEdit"
        >
          <Check :size="16" />
          {{ t('editableField.save') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-(--text-color) rounded-lg hover:cursor-pointer transition-colors flex items-center justify-center"
          @click="cancelEdit"
        >
          <X :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
