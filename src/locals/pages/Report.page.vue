<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import FooterComponent from '../../public/components/Footer.component.vue';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { LocalsApiService } from '../services/locals-api.service';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ReportRequest } from '../model/report.request';
import { ReportsApiService } from '../services/reports-api.service';
import { AlertTriangle, Send, MapPin } from 'lucide-vue-next';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const authenticationStore = useAuthenticationStore();
const localsApiService = new LocalsApiService();
const reportsApiService = new ReportsApiService();
const local = ref({});

const title = ref('');
const description = ref('');
const errors = ref({
  title: '',
  description: '',
  general: ''
});

onMounted(async () => {
  try {
    const id = parseInt(route.params.localId);
    local.value = await localsApiService.getById(id);
  } catch (error) {
    console.error('Error loading local data:', error);
  }
});

const publishReport = async () => {
  errors.value.title = '';
  errors.value.description = '';
  errors.value.general = '';

  if (!title.value.trim()) {
    errors.value.title = t('reportPage.titleRequired');
  }
  if (!description.value.trim()) {
    errors.value.description = t('reportPage.descriptionRequired');
  }

  if (errors.value.title || errors.value.description) return;

  try {
    const reportRequest = new ReportRequest({
      userId: authenticationStore.userId,
      localId: local.value.id,
      title: title.value,
      description: description.value,
    });
    await reportsApiService.create(reportRequest);
    alert(t('reportPage.reportSuccess'));
    router.push(`/local/${local.value.id}`);
  } catch (error) {
    console.error('Error sending report:', error);
    errors.value.general = t('reportPage.reportError');
  }
};
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] flex flex-col gap-6">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="bg-(--primary-color) rounded-full p-3">
          <AlertTriangle :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('reportPage.title') }}</h1>
      </div>
      <div class="flex items-center justify-center gap-2 text-(--text-color)">
        <MapPin :size="18" />
        <p class="text-lg">{{ local.localName }}</p>
      </div>
    </div>

    <!-- Formulario -->
    <div class="max-w-2xl mx-auto w-full bg-(--background-card-color) shadow-lg rounded-xl p-6">
      <div class="flex flex-col gap-5">
        <label class="flex flex-col gap-2">
          <span class="font-semibold text-lg text-(--text-color)">{{ t('reportPage.reportTitle') }}</span>
          <input
            v-model="title"
            type="text"
            :placeholder="t('reportPage.reportTitlePlaceholder')"
            class="border-2 border-gray-300 focus:border-(--primary-color) focus:outline-none p-3 rounded-lg text-base text-(--text-color) bg-(--background-card-color)"
          />
          <span class="text-red-500 text-sm flex items-center gap-1" v-if="errors.title">
            <AlertTriangle :size="14" />
            {{ errors.title }}
          </span>
        </label>

        <label class="flex flex-col gap-2">
          <span class="font-semibold text-lg text-(--text-color)">{{ t('reportPage.problemDescription') }}</span>
          <textarea
            v-model="description"
            :placeholder="t('reportPage.problemDescriptionPlaceholder')"
            class="border-2 border-gray-300 focus:border-(--primary-color) focus:outline-none p-3 rounded-lg text-base min-h-40 text-(--text-color) bg-(--background-card-color)"
          ></textarea>
          <span class="text-red-500 text-sm flex items-center gap-1" v-if="errors.description">
            <AlertTriangle :size="14" />
            {{ errors.description }}
          </span>
        </label>

        <div v-if="errors.general" class="bg-red-50 border-2 border-red-200 rounded-lg p-3">
          <p class="text-red-600 text-sm flex items-center gap-2">
            <AlertTriangle :size="16" />
            {{ errors.general }}
          </p>
        </div>

        <button
          @click="publishReport"
          class="bg-(--primary-color) text-white py-3 px-6 rounded-lg hover:bg-(--primary-color-hover) hover:cursor-pointer transition-colors w-full text-base font-semibold flex items-center justify-center gap-2 mt-2"
        >
          <Send :size="18" />
          {{ t('reportPage.sendReport') }}
        </button>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>
