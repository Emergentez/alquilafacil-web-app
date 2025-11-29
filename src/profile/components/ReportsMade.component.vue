<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ReportsApiService } from '../../locals/services/reports-api.service';
import { ReportResponse } from '../../locals/model/report.response';
import { AlertTriangle, ChevronRight, FileText } from 'lucide-vue-next';

const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const reports = ref([]);
const reportsApiService = new ReportsApiService();

onMounted(async() => {
  const userId = authenticationStore.userId;
  reports.value = await reportsApiService.getByUserId(userId);
});

</script>

<template>
  <div class="w-full p-4 flex flex-col gap-10 text-(--text-color)">
    <h2 class="text-xl md:text-4xl font-bold text-center mb-6 ">
      {{ t('reportsMade.title') }}
    </h2>
    <div v-if="reports.length > 0" class="w-full grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center">
      <div v-for="report in reports" :key="report.id" class="w-full p-6 bg-(--background-card-color) shadow-lg rounded-xl flex items-center gap-4 hover:cursor-pointer hover:shadow-xl transition-all hover:scale-105 border-l-4 border-(--primary-color)">
        <div class="bg-(--primary-color) rounded-full p-3 shrink-0">
          <AlertTriangle :size="24" class="text-white" />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-2">
            <FileText :size="18" class="text-(--text-color)" />
            <h3 class="text-lg font-semibold">{{ t('reportsMade.reportNumber') }}{{ report.id }}</h3>
          </div>
          <h4 class="text-base font-semibold text-(--text-color)">{{ report.title }}</h4>
          <p class="text-sm text-(--text-color) line-clamp-2">{{ report.description }}</p>
        </div>
        <ChevronRight :size="24" class="text-(--text-color) shrink-0 hidden md:block" />
      </div>
    </div>
    <div v-else class="w-full flex flex-col items-center justify-center gap-4 py-10">
      <AlertTriangle :size="64" class="text-gray-400" />
      <p class="text-lg text-center">{{ t('reportsMade.noReports') }}</p>
    </div>
  </div>
</template>