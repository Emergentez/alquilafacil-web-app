<script setup>
import { useI18n } from 'vue-i18n';
import FooterComponent from '../../public/components/Footer.component.vue';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import CalendarComponent from '../components/Calendar.component.vue';
import { Calendar, User, Home, Crown } from 'lucide-vue-next';

const { t } = useI18n();
</script>

<template>
  <NavbarComponent />
  <main class="w-full min-h-[80dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-10 flex flex-col gap-6">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <div class="bg-(--primary-color) rounded-full p-3">
          <Calendar :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('calendar.title') }}</h1>
      </div>
      <p class="text-(--text-color) mt-2 ml-14">{{ t('calendar.subtitle') }}</p>
    </div>

    <!-- Contenido -->
    <div class="flex flex-col xl:flex-row gap-6">
      <div class="flex-1">
        <CalendarComponent />
      </div>

      <!-- Leyenda -->
      <div class="w-full xl:w-80">
        <div class="bg-(--background-card-color) rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-(--text-color) mb-4">{{ t('calendar.legend') }}</h2>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 bg-(--primary-color) rounded"></div>
              <div class="flex items-center gap-2">
                <User :size="18" class="text-(--text-color)" />
                <p class="text-base text-(--text-color)">{{ t('calendar.yourReservations') }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 bg-blue-500 rounded"></div>
              <div class="flex items-center gap-2">
                <Home :size="18" class="text-(--text-color)" />
                <p class="text-base text-(--text-color)">{{ t('calendar.spaceReservation') }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 bg-(--secondary-color) rounded"></div>
              <div class="flex items-center gap-2">
                <Crown :size="18" class="text-(--text-color)" />
                <p class="text-base text-(--text-color)">{{ t('calendar.premiumReservation') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
  <FooterComponent />
</template>
