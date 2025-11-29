<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import NavbarComponent from '../../public/components/Navbar.component.vue';
import { NotificationsApiService } from '../services/notifications-api.service';
import FooterComponent from '../../public/components/Footer.component.vue';
import { Bell, BellOff } from 'lucide-vue-next';

const { t } = useI18n();
const authenticationStore = useAuthenticationStore();
const notificationsApiService = new NotificationsApiService();

const notifications = ref([]);
const isLoaded = ref(false);

onMounted(async () => {
  const userId = authenticationStore.userId;
  notifications.value = await notificationsApiService.getByUserId(userId);
  isLoaded.value = true;
});
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] flex flex-col gap-6">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <div class="bg-(--primary-color) rounded-full p-3">
          <Bell :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('notifications.title') }}</h1>
      </div>
      <p v-if="isLoaded" class="text-(--text-color) mt-2 ml-14">
        {{ notifications.length }} {{ notifications.length === 1 ? t('notifications.notification') : t('notifications.title').toLowerCase() }}
      </p>
    </div>

    <!-- Contenido -->
    <template v-if="isLoaded">
      <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
        <BellOff :size="64" class="text-gray-400" />
        <h2 class="text-2xl font-semibold text-(--text-color)">{{ t('notifications.noNotifications') }}</h2>
        <p class="text-gray-500">{{ t('notifications.noNotificationsHint') }}</p>
      </div>
      <div v-else class="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-(--background-card-color) shadow-md rounded-xl p-5 border-l-4 border-(--primary-color)"
        >
          <div class="flex items-start gap-3">
            <div class="bg-(--primary-color) rounded-full p-2 mt-1">
              <Bell :size="18" class="text-white" />
            </div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-(--text-color) mb-2">{{ notification.title }}</h2>
              <p class="text-(--text-color) leading-relaxed">{{ notification.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
  <FooterComponent />
</template>
