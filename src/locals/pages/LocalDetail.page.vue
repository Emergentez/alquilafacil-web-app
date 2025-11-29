<script setup>
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { ref, computed, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { LocalsApiService } from '../services/locals-api.service';
import { LocalResponse } from '../model/local.response';
import { ReservationRequest } from '../../booking/models/reservation.request';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ReservationsApiService } from '../../booking/services/reservations-api.service';
import { ProfilesApiService } from '../../profile/services/profiles-api.service';
import FooterComponent from '../../public/components/Footer.component.vue';
import { cloudinaryWidget } from '../../shared/components/cloudinary-widget';
import { LocalEdgeNodesApiService } from '../../management/services/local-edge-nodes-api.service';
import { LocalEdgeNodeRequest, LocalEdgeNodeUpdateRequest } from '../../management/model/local-edge-node.request';
import { MapPin, Users, User, FileText, ListChecks, MessageSquare, AlertTriangle, Camera } from 'lucide-vue-next';

const { t } = useI18n();

const route = useRoute();
const authenticationStore = useAuthenticationStore();

const localsApiService = new LocalsApiService();
const reservationsApiService = new ReservationsApiService();
const profilesApiService = new ProfilesApiService();
const localEdgeNodesApiService = new LocalEdgeNodesApiService();

const local = ref({});
const bankAccounts = ref({});
const startDate = ref('');
const endDate = ref('');
const selectedPhoto = ref('');
const voucherImageUrl = ref('');
const localEdgeNode = ref('')
const localEdgeNodeUrl = ref('');
const isLoaded = ref(false);

onMounted(async () => {
  const id = parseInt(route.params.id);
  const response = await localsApiService.getById(id);
  local.value = new LocalResponse(response);
  bankAccounts.value = await profilesApiService.getBankAccountsByUserId(local.value.userId);
  localEdgeNode.value = await localEdgeNodesApiService.getByLocalId(local.value.id);
  selectedPhoto.value = local.value.photoUrls[0];
  isLoaded.value = true;
});

const now = () => new Date().toISOString().slice(0, 16);

const isStartDateValid = computed(() => {
  return startDate.value && startDate.value >= now();
});

const isEndDateValid = computed(() => {
  return (
    endDate.value &&
    startDate.value &&
    endDate.value > startDate.value
  );
});

const isFormValid = computed(() => isStartDateValid.value && isEndDateValid.value);

const totalAmountToPay = computed(() => {
  if (isFormValid.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffInMs = end.getTime() - start.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return Math.round(diffInHours * local.value.price * 100) / 100;
  }
  return 0.00;
});

const openUploadWidget = async () => {
  try {
    const secureUrl = await cloudinaryWidget();
    console.log("Secure URL:", secureUrl);
    voucherImageUrl.value = secureUrl[0]
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const reserveLocal = async () => {
  try {
    const localStartDate = new Date(startDate.value);
    const localEndDate = new Date(endDate.value);

    const startDateUTC = new Date(localStartDate.getTime() - localStartDate.getTimezoneOffset() * 60000);
    const endDateUTC = new Date(localEndDate.getTime() - localEndDate.getTimezoneOffset() * 60000);

    const formattedStartDate = startDateUTC.toISOString();
    const formattedEndDate = endDateUTC.toISOString();

    const reservationRequest = new ReservationRequest({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      localId: local.value.id,
      userId: authenticationStore.userId,
      price: totalAmountToPay.value,
      voucherImageUrl: voucherImageUrl.value,
    });
    console.log(reservationRequest);
    await reservationsApiService.create(reservationRequest);
    alert(t('localDetail.reservationSuccess'));
  } catch (error) {
    console.error('Error reserving local:', error);
    alert(t('localDetail.reservationError'));
  }
};

const assignOrUpdateEdgeNode = async () => {
  console.log(localEdgeNode.value);
  try {
    if (localEdgeNode.value === null) {
      let resource = new LocalEdgeNodeRequest({
        localId: local.value.id,
        edgeNodeUrl: localEdgeNodeUrl.value,
      });
      await localEdgeNodesApiService.create(resource);
      alert(t('localDetail.edgeNodeAssigned'));
    } else {
      let resource = new LocalEdgeNodeUpdateRequest({
        edgeNodeUrl: localEdgeNodeUrl.value,
      });
      await localEdgeNodesApiService.update(local.value.id, resource);
      alert(t('localDetail.edgeNodeUpdated'));
    }
    localEdgeNode.value = await localEdgeNodesApiService.getByLocalId(local.value.id);
  } catch (error) {
    console.error('Error assigning/updating edge node:', error);
    alert(t('localDetail.edgeNodeError'));
  }
};


</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] bg-gradient-to-br from-gray-50 to-gray-100">
    <template v-if="isLoaded">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">{{ local.localName }}</h1>
        <div class="flex items-center gap-2 text-gray-600">
          <MapPin :size="20" class="text-amber-500" />
          <span class="text-lg">{{ local.address }}</span>
        </div>
      </div>

      <div class="w-full flex flex-col lg:flex-row gap-6">
        <!-- Imagenes del local -->
        <div class="w-full lg:w-2/3 flex flex-col gap-4">
          <div class="bg-white rounded-xl shadow-lg p-3">
            <img :src="selectedPhoto" alt="Local image" class="w-full h-[500px] object-cover rounded-lg" />
          </div>

          <div v-if="local.photoUrls.length > 1" class="bg-white rounded-xl shadow-lg p-3">
            <div class="flex gap-2 overflow-x-auto pb-1">
              <img
                v-for="(photo, index) in local.photoUrls"
                :key="index"
                :src="photo"
                alt="Thumbnail"
                class="w-36 h-24 object-cover rounded-md cursor-pointer border-2 transition-all hover:scale-105"
                :class="selectedPhoto === photo ? 'border-amber-500' : 'border-gray-200'"
                @click="selectedPhoto = photo"
              />
            </div>
          </div>
        </div>

        <!-- Panel lateral -->
        <div class="w-full lg:w-1/3 flex flex-col gap-3">

          <!-- Grid: Información y Características -->
          <div class="grid grid-cols-1 gap-3" :class="local.features[0] !== '' ? 'md:grid-cols-2' : ''">
            <!-- Columna izquierda -->
            <div class="flex flex-col gap-3">
              <!-- Información Principal -->
              <div class="bg-white rounded-xl shadow-lg p-4">
                <div class="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                  <div class="bg-amber-100 rounded-full p-2">
                    <Users :size="20" class="text-amber-600" />
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">{{ t('localDetail.maxCapacity') }}</p>
                    <p class="text-xl font-bold text-gray-800">{{ local.capacity }} {{ t('localDetail.people') }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-2">
                  <User :size="18" class="text-purple-500 mt-1" />
                  <div>
                    <p class="text-xs font-medium text-gray-500">{{ t('localDetail.owner') }}</p>
                    <p class="text-base text-gray-800">{{ local.userUsername }}</p>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="bg-white rounded-xl shadow-lg p-4">
                <div class="flex items-center gap-2 mb-3">
                  <FileText :size="18" class="text-emerald-500" />
                  <h2 class="text-lg font-bold text-gray-800">{{ t('localDetail.description') }}</h2>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">{{ local.descriptionMessage }}</p>
              </div>
            </div>

            <!-- Columna derecha: Características -->
            <div v-if="local.features[0] !== ''" class="bg-white rounded-xl shadow-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <ListChecks :size="18" class="text-indigo-500" />
                <h2 class="text-lg font-bold text-gray-800">{{ t('localDetail.features') }}</h2>
              </div>
              <ul class="space-y-1.5">
                <li v-for="(feature, index) in local.features" :key="index"
                    class="flex items-start gap-2 text-sm text-gray-700">
                  <span class="text-emerald-500">✓</span>
                  <span>{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Opciones -->
          <div class="bg-white rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-3">{{ t('localDetail.options') }}</h2>
            <div class="flex flex-col gap-2">
              <RouterLink :to="`/comments/${local.id}`"
                class="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                <MessageSquare :size="18" />
                <span class="text-sm font-medium">{{ t('localDetail.viewComments') }}</span>
              </RouterLink>
              <RouterLink :to="`/report/${local.id}`"
                class="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                <AlertTriangle :size="18" />
                <span class="text-sm font-medium">{{ t('localDetail.reportSpace') }}</span>
              </RouterLink>
            </div>
          </div>

          <!-- Nodo Edge (Admin) -->
          <div v-if="authenticationStore.userId === 1 || authenticationStore.userId === 2" class="bg-white rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-3">
              {{ localEdgeNode === '' ? t('localDetail.assignEdgeNode') : t('localDetail.modifyEdgeNode') }}
            </h2>

            <label class="flex flex-col gap-1.5 mb-3">
              <span class="text-xs font-medium text-gray-700">{{ t('localDetail.edgeNodeUrl') }}</span>
              <input
                v-model="localEdgeNodeUrl"
                type="text"
                placeholder="http://local-edge-node-url.com"
                class="w-full p-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm text-gray-800"
              />
            </label>

            <button
              class="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              @click="assignOrUpdateEdgeNode"
            >
              {{ localEdgeNode === '' ? t('localDetail.assignNode') : t('localDetail.updateNode') }}
            </button>
          </div>

          <!-- Formulario de Reserva -->
          <div v-if="authenticationStore.userId !== local.userId" class="bg-white rounded-xl shadow-lg p-4">
            <h2 class="text-lg font-bold text-gray-800 mb-4">{{ t('localDetail.reserveSpace') }}</h2>

            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-gray-700">{{ t('localDetail.startDateTime') }}</label>
                <input
                  type="datetime-local"
                  class="w-full p-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm text-gray-800"
                  v-model="startDate"
                />
                <p v-if="startDate && !isStartDateValid" class="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle :size="12" />
                  {{ t('localDetail.startDateError') }}
                </p>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-gray-700">{{ t('localDetail.endDateTime') }}</label>
                <input
                  type="datetime-local"
                  class="w-full p-2.5 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-sm text-gray-800"
                  v-model="endDate"
                />
                <p v-if="endDate && !isEndDateValid" class="text-red-500 text-xs flex items-center gap-1">
                  <AlertTriangle :size="12" />
                  {{ t('localDetail.endDateError') }}
                </p>
              </div>

              <!-- Resumen de pago -->
              <div v-if="isFormValid" class="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-3 mt-1">
                <h3 class="text-base font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Users :size="16" class="text-amber-600" />
                  {{ t('localDetail.paymentInfo') }}
                </h3>
                <div class="space-y-1.5 text-xs text-gray-700 mb-3">
                  <div class="flex justify-between">
                    <span class="font-medium">{{ t('localDetail.accountNumber') }}</span>
                    <span class="font-mono">{{ bankAccounts.bankAccountNumber }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-medium">CCI:</span>
                    <span class="font-mono">{{ bankAccounts.interbankAccountNumber }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-1.5 border-t border-amber-300">
                    <span class="font-bold text-sm">{{ t('localDetail.total') }}:</span>
                    <span class="text-xl font-bold text-amber-600">S/. {{ totalAmountToPay.toFixed(2) }}</span>
                  </div>
                </div>

                <button @click="openUploadWidget" class="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-amber-300 rounded-lg hover:border-amber-500 hover:bg-white transition-all cursor-pointer w-full">
                  <Camera :size="32" class="text-amber-600" />
                  <span class="text-center text-gray-700 text-xs font-medium">
                    {{ voucherImageUrl ? t('localDetail.changeVoucher') : t('localDetail.attachVoucher') }}
                  </span>
                  <span v-if="voucherImageUrl" class="text-xs text-emerald-600">✓ {{ t('localDetail.attached') }}</span>
                </button>
              </div>

              <!-- Botón de reserva -->
              <button
                :disabled="!isFormValid || !voucherImageUrl"
                class="w-full bg-amber-500 hover:bg-amber-600 rounded-lg py-3 text-white text-base font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
                @click="reserveLocal"
              >
                {{ t('localDetail.confirmReservation') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Skeleton mientras se carga -->
    <template v-else>
      <!-- Header skeleton -->
      <div class="mb-8">
        <div class="h-10 w-2/3 skeleton mb-2"></div>
        <div class="h-6 w-1/3 skeleton"></div>
      </div>

      <div class="w-full flex flex-col lg:flex-row gap-6">
        <!-- Skeleton de imagen principal -->
        <div class="w-full lg:w-2/3 flex flex-col gap-4">
          <div class="bg-white rounded-xl shadow-lg p-3">
            <div class="h-[500px] w-full skeleton rounded-lg"></div>
          </div>
          <div class="bg-white rounded-xl shadow-lg p-3">
            <div class="flex gap-2">
              <div class="w-36 h-24 skeleton rounded-md"></div>
              <div class="w-36 h-24 skeleton rounded-md"></div>
              <div class="w-36 h-24 skeleton rounded-md"></div>
            </div>
          </div>
        </div>

        <!-- Skeleton panel lateral -->
        <div class="w-full lg:w-1/3 flex flex-col gap-3">
          <!-- Grid skeleton -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <!-- Columna izquierda -->
            <div class="flex flex-col gap-3">
              <div class="bg-white rounded-xl shadow-lg p-4">
                <div class="h-20 w-full skeleton mb-3"></div>
                <div class="h-12 w-full skeleton"></div>
              </div>
              <div class="bg-white rounded-xl shadow-lg p-4">
                <div class="h-6 w-1/2 skeleton mb-3"></div>
                <div class="h-4 w-full skeleton mb-2"></div>
                <div class="h-4 w-full skeleton mb-2"></div>
                <div class="h-4 w-3/4 skeleton"></div>
              </div>
            </div>

            <!-- Columna derecha -->
            <div class="bg-white rounded-xl shadow-lg p-4">
              <div class="h-6 w-2/3 skeleton mb-3"></div>
              <div class="h-4 w-full skeleton mb-2"></div>
              <div class="h-4 w-full skeleton mb-2"></div>
              <div class="h-4 w-full skeleton mb-2"></div>
              <div class="h-4 w-3/4 skeleton"></div>
            </div>
          </div>

          <!-- Opciones skeleton -->
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="h-6 w-1/3 skeleton mb-3"></div>
            <div class="h-10 w-full skeleton mb-2"></div>
            <div class="h-10 w-full skeleton"></div>
          </div>

          <!-- Formulario skeleton -->
          <div class="bg-white rounded-xl shadow-lg p-4">
            <div class="h-6 w-1/2 skeleton mb-4"></div>
            <div class="h-10 w-full skeleton mb-3"></div>
            <div class="h-10 w-full skeleton mb-3"></div>
            <div class="h-12 w-full skeleton"></div>
          </div>
        </div>
      </div>
    </template>
  </main>
  <FooterComponent />
</template>
