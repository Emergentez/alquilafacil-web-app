<script setup>
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProfilesApiService } from '../services/profiles-api.service';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ref } from 'vue';
import { SubscriptionPlansApiService } from '../../subscriptions/services/subscription-plans-api.service';
import { useRouter } from 'vue-router';
import { Crown, Clock, CheckCircle, Loader2, ShoppingCart } from 'lucide-vue-next';

const { t } = useI18n();

const profilesApiService = new ProfilesApiService();
const authenticationStore = useAuthenticationStore();
const subscriptionPlansApiService = new SubscriptionPlansApiService();
const subscriptionStatus = ref('');
const subscriptionPlans = ref([]);
const router = useRouter();
const isLoaded = ref(false);


onMounted(async () => {
  try {
    subscriptionPlans.value = await subscriptionPlansApiService.getAll();
    subscriptionStatus.value = await profilesApiService.getSubscriptionStatusByUserId(authenticationStore.userId);
    console.log(subscriptionStatus.value);
  } catch (error) {
    console.error('Error al cargar datos de suscripción:', error);
  } finally {
    isLoaded.value = true;
  }
});

const goToPurchasePage = (planId) => {
  router.push(`/purchase-subscription/${planId}`);
};

</script>


<template>
  <div class="w-full p-4 flex flex-col gap-5 justify-center items-center">
    <h2 class="text-xl md:text-4xl font-bold text-center mb-6 text-(--text-color)">
      {{ t('profileSubscription.title') }}
    </h2>

    <div v-if="!isLoaded" class="flex flex-col items-center gap-4 py-10">
      <Loader2 :size="48" class="text-(--primary-color) animate-spin" />
      <p class="text-(--text-color)">{{ t('profileSubscription.loading') }}</p>
    </div>

    <div v-else-if="subscriptionStatus === 'No subscription found'" class="flex flex-col gap-6 justify-center items-center text-(--text-color)">
      <div class="flex items-center gap-2 mb-4">
        <Crown :size="32" class="text-(--secondary-color)" />
        <p class="text-center text-2xl font-semibold">{{ t('profileSubscription.getPremium') }}</p>
      </div>
      <button
        v-for="plan in subscriptionPlans"
        :key="plan.id"
        class="w-full max-w-2xl bg-(--background-card-color) flex flex-col justify-center items-center px-8 py-10 gap-4 rounded-xl shadow-lg hover:shadow-2xl hover:cursor-pointer transition-all hover:scale-105 border-2 border-(--secondary-color)"
        @click="goToPurchasePage(plan.id)"
      >
        <Crown :size="64" class="text-(--secondary-color)" />
        <p class="text-3xl font-bold">{{ plan.name }}</p>
        <p class="text-lg text-center">{{ plan.service }}</p>
        <p class="text-center">{{ t('profileSubscription.premiumBenefit') }}</p>
        <div class="flex items-center gap-2 mt-2">
          <p class="text-2xl font-bold text-(--secondary-color)">S/. {{ plan.price }}</p>
        </div>
        <div class="flex items-center gap-2 bg-(--secondary-color) text-white px-6 py-3 rounded-lg mt-2">
          <ShoppingCart :size="20" />
          <span class="font-semibold">{{ t('profileSubscription.buyNow') }}</span>
        </div>
      </button>
    </div>

    <div v-else-if="subscriptionStatus === 'Pending'" class="flex flex-col gap-6 justify-center items-center text-(--text-color) bg-(--background-card-color) p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div class="bg-orange-100 dark:bg-orange-900 rounded-full p-6">
        <Clock :size="64" class="text-orange-600" />
      </div>
      <p class="text-center text-2xl font-semibold">{{ t('profileSubscription.pendingValidation') }}</p>
      <div class="flex items-center gap-2">
        <Crown :size="24" class="text-(--secondary-color)" />
        <p class="text-xl font-semibold">{{ t('profileSubscription.plan') }} {{ subscriptionPlans[0]?.name }}</p>
      </div>
      <p class="text-lg text-center">{{ subscriptionPlans[0]?.service }}</p>
      <p class="text-center text-gray-600 dark:text-gray-400">{{ t('profileSubscription.voucherValidating') }}</p>
    </div>

    <div v-else-if="subscriptionStatus === 'Active'" class="flex flex-col gap-6 justify-center items-center text-(--text-color) bg-(--background-card-color) p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <div class="bg-green-100 dark:bg-green-900 rounded-full p-6">
        <CheckCircle :size="64" class="text-green-600" />
      </div>
      <p class="text-center text-2xl font-semibold">{{ t('profileSubscription.activeSubscription') }}</p>
      <div class="flex items-center gap-2">
        <Crown :size="24" class="text-(--secondary-color)" />
        <p class="text-xl font-semibold">{{ t('profileSubscription.plan') }} {{ subscriptionPlans[0]?.name }}</p>
      </div>
      <p class="text-lg text-center">{{ subscriptionPlans[0]?.service }}</p>
      <div class="w-full bg-green-100 dark:bg-green-900 border-l-4 border-green-600 p-4 rounded">
        <p class="text-green-800 dark:text-green-200">{{ t('profileSubscription.enjoyBenefits') }}</p>
      </div>
    </div>
  </div>
</template>
