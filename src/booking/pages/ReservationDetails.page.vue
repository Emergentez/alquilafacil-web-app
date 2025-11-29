<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { LocalsApiService } from '../../locals/services/locals-api.service';
import { UsersApiService } from '../../shared/services/users-api.service';
import { LocalResponse } from '../../locals/model/local.response';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { computed } from 'vue';
import { toLocalDateTimeString } from '../utils/toLocalDateTimeString';
import { ReservationsApiService } from '../services/reservations-api.service';
import { ReservationRequest } from '../models/reservation.request';
import FooterComponent from '../../public/components/Footer.component.vue';
import { useRouter } from 'vue-router';
import CreateCommentComponent from '../../locals/components/CreateComment.component.vue';
import { Calendar, MapPin, User, Clock, Receipt, MessageSquare, AlertTriangle, X } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const localsApiService = new LocalsApiService();
const usersApiService = new UsersApiService();

const authenticationStore = useAuthenticationStore();
const router = useRouter();

const reservation = ref({});
const local = ref({});
const userUsername = ref('');
const userId = ref(authenticationStore.userId);
const postponeMinutes = ref(10);

const isFormValid = computed(() => postponeMinutes.value >= 10 && postponeMinutes.value <= 60);

onMounted(async() => {
  reservation.value = JSON.parse(localStorage.getItem('reservation'));
  const localResponse = await localsApiService.getById(reservation.value.localId);
  local.value = new LocalResponse(localResponse);
  userUsername.value = await usersApiService.getUsernameById(reservation.value.userId);
  localStorage.removeItem('reservation');
});

const postponeReservation = async () => {
  try {
    const currentStart = new Date(reservation.value.startDate);
    const currentEnd = new Date(reservation.value.endDate);

    const newStart = new Date(currentStart.getTime() + postponeMinutes.value * 60000);
    const newEnd = new Date(currentEnd.getTime() + postponeMinutes.value * 60000);

    reservation.value.startDate = toLocalDateTimeString(newStart);
    reservation.value.endDate = toLocalDateTimeString(newEnd);

    const reservationsApiService = new ReservationsApiService();
    const updateReservationRequest = new ReservationRequest(reservation.value);
    await reservationsApiService.update(reservation.value.id, updateReservationRequest);
    alert(t('reservationDetails.reservationUpdated'));
    router.push('/calendar');
  } catch (error) {
    console.error('Error al posponer la reserva:', error);
    alert(t('reservationDetails.postponeError'));
  }
};

const cancelReservation = async () => {
  try {
    const reservationsApiService = new ReservationsApiService();
    await reservationsApiService.delete(reservation.value.id);
    alert(t('reservationDetails.reservationCancelled'));
    router.push('/calendar');
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    alert(t('reservationDetails.cancelError'));
  }
};


</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[90dvh] bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <div class="bg-emerald-500 rounded-full p-3">
          <Calendar :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-800">{{ t('reservationDetails.title') }}</h1>
      </div>
    </div>

    <div class="w-full flex flex-col lg:flex-row gap-6">
      <div class="w-full lg:w-2/3 flex flex-col gap-4">
        <!-- Imagen del local -->
        <div class="bg-white rounded-xl shadow-lg p-4">
          <template v-if="!local.photoUrls">
            <p class="text-lg text-center text-gray-500">{{ t('reservationDetails.noImages') }}</p>
          </template>
          <template v-else-if="Array.isArray(local.photoUrls) && local.photoUrls.length > 0">
            <img :src="local.photoUrls[0]" alt="Imagen del local" class="w-full h-80 object-cover rounded-lg" />
          </template>
        </div>

        <!-- Información del local -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ local.localName }}</h2>

          <div class="flex items-center gap-2 text-gray-700 mb-3">
            <MapPin :size="20" class="text-amber-500" />
            <p class="text-lg">{{ local.address }}</p>
          </div>

          <div class="flex items-center gap-2 text-gray-700">
            <User :size="20" class="text-purple-500" />
            <p class="text-base">
              <span class="font-semibold">
                {{ local.userId === userId ? t('reservationDetails.renter') : t('reservationDetails.owner') }}
              </span>
              {{ local.userId === userId ? userUsername : local.userUsername }}
            </p>
          </div>
        </div>

        <!-- Fechas de reserva -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock :size="20" class="text-blue-500" />
            {{ t('reservationDetails.reservationSchedule') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
              <p class="text-sm font-medium text-gray-600 mb-1">{{ t('reservationDetails.start') }}</p>
              <p class="text-lg font-semibold text-gray-800">{{ new Date(reservation.startDate).toLocaleString() }}</p>
            </div>
            <div class="bg-red-50 rounded-lg p-4 border border-red-200">
              <p class="text-sm font-medium text-gray-600 mb-1">{{ t('reservationDetails.end') }}</p>
              <p class="text-lg font-semibold text-gray-800">{{ new Date(reservation.endDate).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel lateral -->
      <div class="w-full lg:w-1/3 flex flex-col gap-4">
        <!-- Opciones -->
        <div class="bg-white rounded-xl shadow-lg p-4">
          <h2 class="text-lg font-bold text-gray-800 mb-3">{{ t('reservationDetails.options') }}</h2>
          <div class="flex flex-col gap-2">
            <RouterLink :to="`/comments/${local.id}`"
              class="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
              <MessageSquare :size="18" />
              <span class="text-sm font-medium">{{ t('reservationDetails.viewComments') }}</span>
            </RouterLink>
            <RouterLink :to="`/report/${local.id}`"
              class="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
              <AlertTriangle :size="18" />
              <span class="text-sm font-medium">{{ t('reservationDetails.reportSpace') }}</span>
            </RouterLink>
          </div>
        </div>

        <!-- Aviso Premium -->
        <div
          v-if="new Date(reservation.startDate) >= new Date() && reservation.isSubscribe && local.userId === userId"
          class="bg-purple-50 border-2 border-purple-200 rounded-xl p-4"
        >
          <p class="text-sm text-purple-700 flex items-start gap-2">
            <AlertTriangle :size="18" class="mt-0.5 flex-shrink-0" />
            <span>{{ t('reservationDetails.premiumNotice') }}</span>
          </p>
        </div>

        <!-- Modificar horario -->
        <div v-else-if="new Date(reservation.startDate) >= new Date() && local.userId === userId" class="bg-white rounded-xl shadow-lg p-4">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Clock :size="18" class="text-blue-500" />
            {{ t('reservationDetails.modifySchedule') }}
          </h3>
          <p class="text-sm text-gray-600 mb-3">{{ t('reservationDetails.minutesToPostpone') }}</p>
          <input
            type="number"
            v-model.number="postponeMinutes"
            :min="10"
            :max="60"
            step="5"
            class="w-full p-2.5 mb-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-gray-800"
          />

          <button
            @click="postponeReservation"
            :disabled="!isFormValid"
            class="w-full bg-amber-500 hover:bg-amber-600 rounded-lg py-3 text-white font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('reservationDetails.postponeReservation') }}
          </button>
        </div>

        <!-- Voucher -->
        <div v-if="new Date(reservation.startDate) >= new Date() && local.userId === userId" class="bg-white rounded-xl shadow-lg p-4">
          <h3 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Receipt :size="18" class="text-emerald-500" />
            {{ t('reservationDetails.paymentVoucher') }}
          </h3>
          <a :href="reservation.voucherImageUrl" target="_blank" class="block mb-3">
            <img
              v-if="reservation.voucherImageUrl"
              :src="reservation.voucherImageUrl"
              :alt="t('reservationDetails.paymentVoucher')"
              class="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            />
          </a>
          <button
            @click="cancelReservation"
            class="w-full bg-red-500 hover:bg-red-600 rounded-lg py-3 text-white font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            <X :size="18" />
            {{ t('reservationDetails.cancelReservation') }}
          </button>
        </div>

        <!-- Crear comentario -->
        <CreateCommentComponent :localId="local.id" v-if="new Date(reservation.endDate) < new Date() && local.userId !== userId" />
      </div>
    </div>
  </main>
  <FooterComponent />
</template>