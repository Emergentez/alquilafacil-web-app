<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import NavbarComponent from '@/public/components/Navbar.component.vue'
import Step1Component from '../components/publish-steps/Step1.component.vue';
import Step2Component from '../components/publish-steps/Step2.component.vue';
import Step3Component from '../components/publish-steps/Step3.component.vue';
import Step4Component from '../components/publish-steps/Step4.component.vue';
import Step5Component from '../components/publish-steps/Step5.component.vue';
import Step6Component from '../components/publish-steps/Step6.component.vue';
import Step7Component from '../components/publish-steps/Step7.component.vue';
import Step8Component from '../components/publish-steps/Step8.component.vue';
import Step9Component from '../components/publish-steps/Step9.component.vue';
import Step10Component from '../components/publish-steps/Step10.component.vue';
import { LocalsApiService } from '../services/locals-api.service';
import { useRouter } from 'vue-router';
import { LocalRequest } from '../model/local.request';
import { LocalResponse } from '../model/local.response';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import FooterComponent from '../../public/components/Footer.component.vue';
import { ChevronLeft, ChevronRight, Check } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authenticationStore = useAuthenticationStore();

const localData = ref({
  localName: '',
  descriptionMessage: '',
  country: '',
  city: '',
  district: '',
  street: '',
  price: 0,
  capacity: '',
  photoUrls: [],
  features: [],
  localCategoryId: 1,
  userId: '',
})

const pageNumber = ref(1);

const changePage = (number) => {
  const nextPage = pageNumber.value + number;
  if (nextPage > 0 && nextPage <= 10) {
    pageNumber.value = nextPage;
    console.log(localData.value)
  } else {
    console.warn(`Page out of range: ${nextPage}`);
  }
};

const publishLocal = async () => {
  localData.value.userId = authenticationStore.userId;
  console.log(localData.value)
  const allFieldsFilled = Object.entries(localData).every(([key, value]) => {
    return value !== null && value !== undefined && value !== '' && value !== 0;
  });

  if (!allFieldsFilled) {
    console.log('Not all required fields are filled.');
    router.push('/error');
    return;
  }
  const localsApiService = new LocalsApiService();

  const localRequest = new LocalRequest(localData.value);
  try {
    const response = await localsApiService.create(localRequest);
    const localResponse = new LocalResponse(response);
    router.push(`/local/${localResponse.id}`);
  }
  catch (error) {
    console.error('Error publishing local:', error);
    router.push('/error');
  }
}
</script>

<template>
  <NavbarComponent />
  <main class="w-full min-h-[80dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-20 flex flex-col justify-center items-center gap-4">
    <!-- Progress indicator -->
    <div v-if="pageNumber > 1" class="w-full max-w-3xl mb-8">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-(--text-color)">{{ t('spaces.publish.stepOf', { current: pageNumber - 1, total: 9 }) }}</span>
        <span class="text-sm font-medium text-(--text-color)">{{ Math.round(((pageNumber - 1) / 9) * 100) }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="bg-(--secondary-color) h-2 rounded-full transition-all duration-300" :style="`width: ${((pageNumber - 1) / 9) * 100}%`"></div>
      </div>
    </div>

    <!-- Steps -->
    <Step1Component v-if="pageNumber === 1" />
    <button @click="changePage(1)" v-if="pageNumber === 1" class="bg-(--secondary-color) text-white rounded-lg px-20 md:px-36 py-4 mt-10 text-xl font-semibold hover:bg-(--secondary-color-hover) hover:cursor-pointer transition-colors flex items-center gap-2">
      {{ t('spaces.publish.letsStart') }}
      <ChevronRight :size="24" />
    </button>

    <Step2Component v-if="pageNumber === 2" />
    <Step3Component v-if="pageNumber === 3" v-model:localCategoryId="localData.localCategoryId" />
    <Step4Component v-if="pageNumber === 4" v-model:country="localData.country" v-model:city="localData.city" v-model:district="localData.district" v-model:street="localData.street"/>
    <Step5Component v-if="pageNumber === 5" />
    <Step6Component v-if="pageNumber === 6" v-model:photoUrls="localData.photoUrls" />
    <Step7Component v-if="pageNumber === 7" v-model:localName="localData.localName" v-model:descriptionMessage="localData.descriptionMessage" v-model:capacity="localData.capacity" v-model:features="localData.features" />
    <Step8Component v-if="pageNumber === 8" />
    <Step9Component v-if="pageNumber === 9" v-model:price="localData.price" />

    <!-- Navigation buttons (steps 2-9) -->
    <div v-if="pageNumber > 1 && pageNumber < 10" class="flex gap-4 mt-10">
      <button @click="changePage(-1)" class="bg-(--background-card-color) text-(--text-color) rounded-lg px-8 md:px-24 py-4 text-lg font-semibold border-2 border-(--secondary-color) hover:border-(--secondary-color-hover) hover:cursor-pointer transition-colors flex items-center gap-2">
        <ChevronLeft :size="20" />
        {{ t('spaces.publish.back') }}
      </button>
      <button @click="changePage(1)" class="bg-(--secondary-color) text-white rounded-lg px-8 md:px-24 py-4 text-lg font-semibold hover:bg-(--secondary-color-hover) hover:cursor-pointer transition-colors flex items-center gap-2">
        {{ t('spaces.publish.next') }}
        <ChevronRight :size="20" />
      </button>
    </div>

    <!-- Step 10 (final review) -->
    <Step10Component v-if="pageNumber === 10" v-model:localData="localData" @update:localData="localData = $event"/>
    <div v-if="pageNumber === 10" class="flex gap-4 mt-10">
      <button @click="changePage(-1)" class="bg-(--background-card-color) text-(--text-color) rounded-lg px-8 md:px-24 py-4 text-lg font-semibold border-2 border-(--secondary-color) hover:border-(--secondary-color-hover) hover:cursor-pointer transition-colors flex items-center gap-2">
        <ChevronLeft :size="20" />
        {{ t('spaces.publish.back') }}
      </button>
      <template v-if="localData.localName && localData.descriptionMessage && localData.country && localData.city && localData.district && localData.street && localData.price > 0 && localData.capacity > 0 && localData.photoUrls.length > 0 && localData.features.length > 0">
        <button @click="publishLocal" class="bg-(--secondary-color) text-white rounded-lg px-8 md:px-24 py-4 text-lg font-semibold hover:bg-(--secondary-color-hover) hover:cursor-pointer transition-colors flex items-center gap-2">
          <Check :size="20" />
          {{ t('spaces.publish.submitButton') }}
        </button>
      </template>
    </div>
  </main>
  <FooterComponent />
</template>
