<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { LocalsApiService } from '../../locals/services/locals-api.service';
import { ReadingsApiService } from '../services/readings-api.service';
import { useRoute } from 'vue-router';
import { LocalResponse } from '../../locals/model/local.response';
import { ReadingResponse } from '../model/reading.response';
import { ReadingsSignalRService } from '../services/readings-signal.service';
import FooterComponent from '../../public/components/Footer.component.vue';
import { Users, Volume2, Flame, ShieldAlert, Activity, ClipboardList } from 'lucide-vue-next';

const { t } = useI18n();

const localsApiService = new LocalsApiService();
const readingsApiService = new ReadingsApiService();
const readingsSignalRService = new ReadingsSignalRService();

const route = useRoute();
const localId = parseInt(route.params.localId);

const viewMode = ref('monitoring');

const local = ref({});
const readings = ref([]);
const isLoaded = ref(false);
const incidents = ref([]);

const sensorTypes = {
  SMOKE: 1,
  NOISE: 2,
  CAPACITY: 3,
  RESTRICTEDAREA: 4
}

const handleNewReading = (reading) => {
  const readingResponse = new ReadingResponse(reading);
  readings.value.unshift(readingResponse);
};


onMounted(async () => {
  try {
    const localResponse = await localsApiService.getById(localId);
    local.value = new LocalResponse(localResponse);

    const readingsResponse = await readingsApiService.getByLocalId(localId);
    readings.value = readingsResponse.map(reading => new ReadingResponse(reading));

    await readingsSignalRService.connect(localId, handleNewReading);

    isLoaded.value = true;
  } catch (error) {
    console.error("Error loading initial data:", error);
  }
});

onBeforeUnmount(async () => {
  await readingsSignalRService.disconnect(localId);
});

const getLatestReadingForSensorTypeId = (id) => readings.value.find(reading => reading.sensorTypeId === id) ?? null;

</script>
<template>
  <NavbarComponent />
  <main class="flex flex-col items-center px-4 sm:px-8 py-10 w-full min-h-[80dvh] bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header mejorado -->
    <div class="w-full max-w-6xl mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2 text-gray-800">{{ t('monitoring.title') }}</h1>
          <p class="text-gray-600">{{ t('monitoring.subtitle') }}</p>
        </div>
        <!-- Indicador en vivo -->
        <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <div class="relative">
            <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <div class="absolute top-0 left-0 w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ t('monitoring.live') }}</span>
        </div>
      </div>
    </div>

    <!-- Switch mejorado -->
    <div class="flex items-center gap-2 mb-8 bg-white rounded-full p-1.5 shadow-md">
      <button
        @click="viewMode = 'monitoring'"
        :class="viewMode === 'monitoring'
          ? 'bg-emerald-500 text-white shadow-lg scale-105'
          : 'bg-transparent text-gray-600 hover:bg-gray-100'"
        class="px-6 py-2.5 rounded-full transition-all duration-300 font-medium flex items-center gap-2 cursor-pointer"
      >
        <Activity :size="20" />
        {{ t('monitoring.liveMonitoring') }}
      </button>
      <button
        @click="viewMode = 'incidents'"
        :class="viewMode === 'incidents'
          ? 'bg-amber-500 text-white shadow-lg scale-105'
          : 'bg-transparent text-gray-600 hover:bg-gray-100'"
        class="px-6 py-2.5 rounded-full transition-all duration-300 font-medium flex items-center gap-2 cursor-pointer"
      >
        <ClipboardList :size="20" />
        {{ t('monitoring.history') }}
      </button>
    </div>
    <!-- Contenedor principal -->
    <template v-if="isLoaded">
      <div class="w-full max-w-6xl">
        <!-- Nombre del local y resumen -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 class="text-2xl font-bold text-gray-800 text-center mb-4">{{ local.localName }}</h2>

          <!-- Resumen rápido -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div class="text-center p-3 bg-blue-50 rounded-xl">
              <p class="text-xs text-gray-600 mb-1">{{ t('monitoring.totalReadings') }}</p>
              <p class="text-2xl font-bold text-blue-600">{{ readings.length }}</p>
            </div>
            <div class="text-center p-3 bg-emerald-50 rounded-xl">
              <p class="text-xs text-gray-600 mb-1">{{ t('monitoring.maxCapacity') }}</p>
              <p class="text-2xl font-bold text-emerald-600">{{ local.capacity }}</p>
            </div>
            <div class="text-center p-3 bg-orange-50 rounded-xl">
              <p class="text-xs text-gray-600 mb-1">{{ t('monitoring.alertsToday') }}</p>
              <p class="text-2xl font-bold text-orange-600">{{ readings.filter(r => [sensorTypes.SMOKE, sensorTypes.NOISE, sensorTypes.RESTRICTEDAREA].includes(r.sensorTypeId)).length }}</p>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-xl">
              <p class="text-xs text-gray-600 mb-1">{{ t('monitoring.state') }}</p>
              <p class="text-sm font-bold text-emerald-600">{{ t('monitoring.active') }}</p>
            </div>
          </div>
        </div>

        <!-- Vista de monitoreo -->
        <div v-if="viewMode === 'monitoring'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Aforo -->
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-blue-500 cursor-pointer group">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-blue-100 rounded-full p-4 group-hover:bg-blue-200 transition-colors duration-300">
                <Users :size="32" class="text-blue-600" />
              </div>
              <div class="text-right">
                <div class="flex items-center gap-2 justify-end mb-1">
                  <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">{{ t('monitoring.sensors.occupancy') }}</p>
                  <span
                    class="text-xs px-2 py-1 rounded-full font-semibold"
                    :class="(getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? 0) > local.capacity * 0.8
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'"
                  >
                    {{ ((getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? 0) / local.capacity * 100).toFixed(0) }}%
                  </span>
                </div>
                <p class="text-4xl font-bold text-blue-600">
                  {{ getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? '0' }}<span class="text-2xl text-gray-400">/{{ local.capacity }}</span>
                </p>
              </div>
            </div>
            <!-- Barra de progreso -->
            <div class="mb-3">
              <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="(getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? 0) > local.capacity * 0.8
                    ? 'bg-red-500'
                    : 'bg-blue-500'"
                  :style="`width: ${Math.min(((getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.message ?? 0) / local.capacity * 100), 100)}%`"
                ></div>
              </div>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 font-medium">{{ t('monitoring.sensors.occupancyCapacity') }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ getLatestReadingForSensorTypeId(sensorTypes.CAPACITY)?.timestamp ?? 'N/A' }}</span>
            </div>
          </div>

          <!-- Ruido -->
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-orange-500 cursor-pointer group">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-orange-100 rounded-full p-4 group-hover:bg-orange-200 transition-colors duration-300">
                <Volume2 :size="32" class="text-orange-600" />
              </div>
              <div class="text-right">
                <div class="flex items-center gap-2 justify-end mb-1">
                  <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">{{ t('monitoring.sensors.noise') }}</p>
                  <span class="text-xs px-2 py-1 rounded-full font-semibold bg-orange-100 text-orange-700">
                    {{ t('monitoring.sensors.monitoring') }}
                  </span>
                </div>
                <p class="text-4xl font-bold text-orange-600">
                  {{ getLatestReadingForSensorTypeId(sensorTypes.NOISE)?.message ?? '0 dB' }}
                </p>
              </div>
            </div>
            <div class="border-t border-gray-100 pt-3 mt-3"></div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 font-medium">{{ t('monitoring.sensors.noiseMax') }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ getLatestReadingForSensorTypeId(sensorTypes.NOISE)?.timestamp ?? 'N/A' }}</span>
            </div>
          </div>

          <!-- Humo -->
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-red-500 cursor-pointer group">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-red-100 rounded-full p-4 group-hover:bg-red-200 transition-colors duration-300">
                <Flame :size="32" class="text-red-600" />
              </div>
              <div class="text-right">
                <div class="flex items-center gap-2 justify-end mb-1">
                  <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">{{ t('monitoring.sensors.smoke') }}</p>
                  <span class="text-xs px-2 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-700">
                    {{ t('monitoring.sensors.safe') }}
                  </span>
                </div>
                <p class="text-2xl font-bold text-red-600">
                  {{ getLatestReadingForSensorTypeId(sensorTypes.SMOKE)?.message ?? t('monitoring.sensors.allGood') }}
                </p>
              </div>
            </div>
            <div class="border-t border-gray-100 pt-3 mt-3"></div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 font-medium">{{ t('monitoring.sensors.smokeStatus') }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ getLatestReadingForSensorTypeId(sensorTypes.SMOKE)?.timestamp ?? 'N/A' }}</span>
            </div>
          </div>

          <!-- Acceso no autorizado -->
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-purple-500 cursor-pointer group">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-purple-100 rounded-full p-4 group-hover:bg-purple-200 transition-colors duration-300">
                <ShieldAlert :size="32" class="text-purple-600" />
              </div>
              <div class="text-right">
                <div class="flex items-center gap-2 justify-end mb-1">
                  <p class="text-sm text-gray-500 font-medium uppercase tracking-wider">{{ t('monitoring.sensors.access') }}</p>
                  <span class="text-xs px-2 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-700">
                    {{ t('monitoring.sensors.protected') }}
                  </span>
                </div>
                <p class="text-2xl font-bold text-purple-600">
                  {{ getLatestReadingForSensorTypeId(sensorTypes.RESTRICTEDAREA)?.message ?? t('monitoring.sensors.allSafe') }}
                </p>
              </div>
            </div>
            <div class="border-t border-gray-100 pt-3 mt-3"></div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 font-medium">{{ t('monitoring.sensors.accessControl') }}</span>
              <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{ getLatestReadingForSensorTypeId(sensorTypes.RESTRICTEDAREA)?.timestamp ?? 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- Última actividad (solo en vista de monitoreo) -->
        <div v-if="viewMode === 'monitoring' && readings.length > 0" class="mt-6">
          <div class="bg-white rounded-2xl shadow-sm p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity :size="20" class="text-gray-600" />
                {{ t('monitoring.lastActivity') }}
              </h3>
              <span class="text-xs text-gray-500">{{ t('monitoring.lastReadings') }}</span>
            </div>
            <div class="space-y-2">
              <div
                v-for="(reading, index) in readings.slice(0, 5)"
                :key="index"
                class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-red-500': reading.sensorTypeId === sensorTypes.SMOKE,
                      'bg-orange-500': reading.sensorTypeId === sensorTypes.NOISE,
                      'bg-blue-500': reading.sensorTypeId === sensorTypes.CAPACITY,
                      'bg-purple-500': reading.sensorTypeId === sensorTypes.RESTRICTEDAREA
                    }"
                  ></div>
                  <span class="text-sm text-gray-700">
                    <span v-if="reading.sensorTypeId === sensorTypes.SMOKE" class="font-medium">{{ t('monitoring.sensors.smoke') }}:</span>
                    <span v-else-if="reading.sensorTypeId === sensorTypes.NOISE" class="font-medium">{{ t('monitoring.sensors.noise') }}:</span>
                    <span v-else-if="reading.sensorTypeId === sensorTypes.CAPACITY" class="font-medium">{{ t('monitoring.sensors.occupancy') }}:</span>
                    <span v-else-if="reading.sensorTypeId === sensorTypes.RESTRICTEDAREA" class="font-medium">{{ t('monitoring.sensors.access') }}:</span>
                    {{ reading.message }}
                  </span>
                </div>
                <span class="text-xs text-gray-500">{{ reading.timestamp }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Vista de incidencias -->
        <div v-else class="space-y-4">
          <div v-if="readings.length > 0" class="space-y-3">
            <div
              v-for="(reading, index) in readings"
              :key="index"
              class="bg-white rounded-xl shadow-md p-6 border-l-4 transition-all hover:shadow-lg"
              :class="{
                'border-red-500': reading.sensorTypeId === sensorTypes.SMOKE,
                'border-orange-500': reading.sensorTypeId === sensorTypes.NOISE,
                'border-blue-500': reading.sensorTypeId === sensorTypes.CAPACITY,
                'border-purple-500': reading.sensorTypeId === sensorTypes.RESTRICTEDAREA
              }"
            >
              <div class="flex items-start gap-4">
                <!-- Icono -->
                <div
                  class="rounded-full p-3"
                  :class="{
                    'bg-red-100': reading.sensorTypeId === sensorTypes.SMOKE,
                    'bg-orange-100': reading.sensorTypeId === sensorTypes.NOISE,
                    'bg-blue-100': reading.sensorTypeId === sensorTypes.CAPACITY,
                    'bg-purple-100': reading.sensorTypeId === sensorTypes.RESTRICTEDAREA
                  }"
                >
                  <Flame v-if="reading.sensorTypeId === sensorTypes.SMOKE" :size="24" class="text-red-600" />
                  <Volume2 v-else-if="reading.sensorTypeId === sensorTypes.NOISE" :size="24" class="text-orange-600" />
                  <Users v-else-if="reading.sensorTypeId === sensorTypes.CAPACITY" :size="24" class="text-blue-600" />
                  <ShieldAlert v-else-if="reading.sensorTypeId === sensorTypes.RESTRICTEDAREA" :size="24" class="text-purple-600" />
                </div>

                <!-- Contenido -->
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3
                      class="font-semibold text-lg"
                      :class="{
                        'text-red-700': reading.sensorTypeId === sensorTypes.SMOKE,
                        'text-orange-700': reading.sensorTypeId === sensorTypes.NOISE,
                        'text-blue-700': reading.sensorTypeId === sensorTypes.CAPACITY,
                        'text-purple-700': reading.sensorTypeId === sensorTypes.RESTRICTEDAREA
                      }"
                    >
                      <span v-if="reading.sensorTypeId === sensorTypes.SMOKE">{{ t('monitoring.alerts.smokeAlert') }}</span>
                      <span v-else-if="reading.sensorTypeId === sensorTypes.NOISE">{{ t('monitoring.alerts.noiseAlert') }}</span>
                      <span v-else-if="reading.sensorTypeId === sensorTypes.CAPACITY">{{ t('monitoring.alerts.capacityUpdate') }}</span>
                      <span v-else-if="reading.sensorTypeId === sensorTypes.RESTRICTEDAREA">{{ t('monitoring.alerts.unauthorizedAccess') }}</span>
                    </h3>
                    <span class="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {{ reading.timestamp }}
                    </span>
                  </div>
                  <p class="text-gray-700">
                    <span v-if="reading.sensorTypeId === sensorTypes.CAPACITY" class="font-medium">
                      {{ t('monitoring.sensors.occupancy') }}: {{ reading.message }}/{{ local.capacity }} {{ t('localDetail.people') }}
                    </span>
                    <span v-else>{{ reading.message }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
            <div class="flex flex-col items-center gap-4">
              <div class="bg-green-100 rounded-full p-6">
                <Activity :size="48" class="text-green-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-700">{{ t('monitoring.systemNormal') }}</h3>
              <p class="text-gray-500">{{ t('monitoring.noIncidentsDetected') }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- Estado de carga mejorado -->
    <template v-else>
      <div class="w-full max-w-6xl">
        <!-- Skeleton del nombre del local -->
        <div class="bg-white rounded-2xl shadow-sm p-6 mb-6 animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>

        <!-- Skeleton de las tarjetas -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="i" class="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-gray-200 rounded-full w-16 h-16"></div>
              <div class="text-right space-y-2">
                <div class="h-4 bg-gray-200 rounded w-24"></div>
                <div class="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="h-4 bg-gray-200 rounded w-32"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
  <FooterComponent />
</template>
