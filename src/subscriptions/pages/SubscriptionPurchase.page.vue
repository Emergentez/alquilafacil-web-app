<script setup lang="ts">

import NavbarComponent from '../../public/components/Navbar.component.vue';
import FooterComponent from '../../public/components/Footer.component.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SubscriptionPlansApiService } from '../services/subscription-plans-api.service';
import { ProfilesApiService } from '../../profile/services/profiles-api.service';
import { SubscriptionsApiService } from '../services/subscriptions-api.service';
import { SubscriptionRequest } from '../model/subscription.request';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { cloudinaryWidget } from '../../shared/components/cloudinary-widget';
import { CreditCard, Building2, Upload, ShoppingCart } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const authenticationStore = useAuthenticationStore();
const subscriptionPlansApiService = new SubscriptionPlansApiService();
const profilesApiService = new ProfilesApiService();
const subscriptionsApiService = new SubscriptionsApiService();
const plan = ref({});
const bankAccounts = ref({});
const voucherImageUrl = ref('');

onMounted(async () => {
  const planId = parseInt(route.params.planId);
  const subscriptionPlans = await subscriptionPlansApiService.getAll();
  bankAccounts.value = await profilesApiService.getBankAccountsByUserId(1);
  plan.value = subscriptionPlans.find(plan => plan.id === planId);
});

const openUploadWidget = async () => {
  try {
    const secureUrls = await cloudinaryWidget();
    console.log("URL segura:", secureUrls);
    voucherImageUrl.value = secureUrls[0];
  } catch (error) {
    console.error("Error al subir imagen:", error);
  }
};

const purchaseSubscription = async () => {
  try {
    const subscriptionRequest = new SubscriptionRequest({
      planId: plan.value.id,
      userId: authenticationStore.userId,
      voucherImageUrl: voucherImageUrl.value,
    });
    await subscriptionsApiService.create(subscriptionRequest);
    alert(t('subscriptionPurchase.voucherValidation'));
    router.push('/');
  } catch (error) {
    alert(t('subscriptionPurchase.purchaseError'));
  }
};

</script>

<template>
  <NavbarComponent />
  <main class="flex flex-col items-center gap-6 w-full min-h-[80dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-10">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center justify-center gap-3">
        <div class="bg-(--primary-color) rounded-full p-3">
          <CreditCard :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('subscriptionPurchase.title') }}</h1>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-3xl w-full flex flex-col gap-6">
      <!-- Plan info -->
      <div class="bg-(--background-card-color) shadow-lg rounded-xl p-6">
        <h2 class="text-2xl font-bold text-(--text-color) mb-4">{{ t('subscriptionPurchase.planSummary') }}</h2>
        <div class="flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <span class="text-(--text-color)">{{ t('subscriptionPurchase.selectedPlan') }}</span>
            <span class="text-lg font-semibold text-(--text-color)">{{ plan.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-(--text-color)">{{ t('subscriptionPurchase.price') }}</span>
            <span class="text-2xl font-bold text-(--secondary-color)">S/. {{ plan.price }}</span>
          </div>
        </div>
      </div>

      <!-- Bank accounts -->
      <div class="bg-(--background-card-color) shadow-lg rounded-xl p-6">
        <div class="flex items-center gap-2 mb-4">
          <Building2 :size="24" class="text-(--primary-color)" />
          <h2 class="text-2xl font-bold text-(--text-color)">{{ t('subscriptionPurchase.bankAccounts') }}</h2>
        </div>
        <p class="text-(--text-color) mb-4">{{ t('subscriptionPurchase.payToAccounts') }}</p>
        <div class="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-(--text-color)">{{ t('subscriptionPurchase.bankAccount') }}</span>
            <span class="text-(--text-color)">{{ bankAccounts.bankAccountNumber }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold text-(--text-color)">{{ t('subscriptionPurchase.interbankAccount') }}</span>
            <span class="text-(--text-color)">{{ bankAccounts.interbankAccountNumber }}</span>
          </div>
        </div>
      </div>

      <!-- Upload voucher -->
      <div class="bg-(--background-card-color) shadow-lg rounded-xl p-6">
        <h2 class="text-2xl font-bold text-(--text-color) mb-4">{{ t('subscriptionPurchase.paymentVoucher') }}</h2>
        <p class="text-(--text-color) mb-4">{{ t('subscriptionPurchase.toComplete') }}</p>

        <button @click="openUploadWidget" class="w-full border-2 border-dashed border-(--primary-color) rounded-xl p-8 hover:bg-(--text-button-color) transition-colors flex flex-col items-center gap-3">
          <Upload :size="48" class="text-(--primary-color)" />
          <span class="text-lg font-semibold text-(--text-color)">{{ t('subscriptionPurchase.attachVoucher') }}</span>
          <span class="text-sm text-gray-500">{{ t('subscriptionPurchase.clickToSelect') }}</span>
        </button>

        <button
          :disabled="!voucherImageUrl"
          class="w-full mt-6 bg-(--secondary-color) rounded-lg py-4 text-white text-lg font-semibold hover:cursor-pointer hover:bg-(--secondary-color-hover) transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          @click="purchaseSubscription"
        >
          <ShoppingCart :size="20" />
          {{ t('subscriptionPurchase.purchaseSubscription') }}
        </button>
      </div>
    </div>
  </main>
  <FooterComponent />
</template>