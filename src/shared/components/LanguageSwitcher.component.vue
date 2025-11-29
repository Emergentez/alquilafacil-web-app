<script setup>
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import { Globe } from 'lucide-vue-next';

const { locale, t } = useI18n();
const isOpen = ref(false);

const languages = [
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'en', name: 'English', flag: 'EN' }
];

const currentLanguage = ref(languages.find(l => l.code === locale.value) || languages[0]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (lang) => {
  locale.value = lang.code;
  currentLanguage.value = lang;
  localStorage.setItem('locale', lang.code);
  isOpen.value = false;
};

watch(locale, (newLocale) => {
  currentLanguage.value = languages.find(l => l.code === newLocale) || languages[0];
});
</script>

<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg bg-(--background-card-color) hover:bg-(--text-button-color) transition-colors text-(--text-color)"
    >
      <Globe :size="18" />
      <span class="text-sm font-medium">{{ currentLanguage.flag }}</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-40 bg-(--background-card-color) rounded-lg shadow-lg overflow-hidden z-50"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="selectLanguage(lang)"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-(--text-button-color) transition-colors text-(--text-color)"
        :class="{ 'bg-(--primary-color) text-white': currentLanguage.code === lang.code }"
      >
        <span class="text-sm font-bold">{{ lang.flag }}</span>
        <span class="text-sm">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>
