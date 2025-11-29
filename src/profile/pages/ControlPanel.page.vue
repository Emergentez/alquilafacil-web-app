<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../../auth/services/authentication.store.js';
import NavbarComponent from '@/public/components/Navbar.component.vue';

import { onMounted, ref, computed } from 'vue';
import UpdateProfileComponent from '../components/UpdateProfile.component.vue';
import { ProfilesApiService } from '../services/profiles-api.service.js';
import ReportsMadeComponent from '../components/ReportsMade.component.vue';
import PublishedSpacesComponent from '../components/PublishedSpaces.component.vue';
import FooterComponent from '../../public/components/Footer.component.vue';
import ProfileSubscriptionComponent from '../components/ProfileSubscription.component.vue';
import FavoritesComponent from '../components/Favorites.component.vue';
import SubscriptionsManagementComponent from '../components/SubscriptionsManagement.component.vue';
import SupportComponent from '../components/Support.component.vue';
import { Settings, User, CreditCard, Home, Star, HelpCircle, AlertTriangle, Users, LogOut, Moon, Sun, ChevronRight } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authenticationStore = useAuthenticationStore();

const userId = ref(null);
const profile = ref({});
const profilesApiService = new ProfilesApiService();

const options = computed(() => [
  { key: 'modificarPerfil', label: t('controlPanel.options.modifyProfile'), icon: User },
  { key: 'miSuscripcion', label: t('controlPanel.options.mySubscription'), icon: CreditCard },
  { key: 'espaciosPublicados', label: t('controlPanel.options.publishedSpaces'), icon: Home },
  ...(authenticationStore.userId === 1 ? [{ key: 'gestionDeSuscripciones', label: t('controlPanel.options.subscriptionManagement'), icon: Users }] : []),
  { key: 'espaciosFavoritos', label: t('controlPanel.options.favoriteSpaces'), icon: Star },
  { key: 'soporte', label: t('controlPanel.options.support'), icon: HelpCircle },
  { key: 'reportesRealizados', label: t('controlPanel.options.reportsMade'), icon: AlertTriangle },
]);

const option = ref('modificarPerfil');
const isDarkTheme = ref(false);

onMounted(async () => {
  userId.value = authenticationStore.userId;
  const profileResponse = await profilesApiService.getByUserId(userId.value);
  const bankAccountsResponse = await profilesApiService.getBankAccountsByUserId(userId.value);
  profile.value = { ...profileResponse, ...bankAccountsResponse };

  const savedTheme = localStorage.getItem("theme");
  isDarkTheme.value = savedTheme === "dark";
});

const toggleTheme = () => {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  isDarkTheme.value = newTheme === "dark";
}

const handleOptionClick = (key) => {
  option.value = key;
};

const handleLogout = () => {
  authenticationStore.signOut(router);
};
</script>

<template>
  <NavbarComponent />
  <main class="w-full min-h-[80dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-10 gap-6 flex flex-col">
    <!-- Header -->
    <div class="mb-4">
      <div class="flex items-center gap-3">
        <div class="bg-(--primary-color) rounded-full p-3">
          <Settings :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-(--text-color)">{{ t('controlPanel.title') }}</h1>
      </div>
    </div>

    <div class="w-full flex flex-col lg:flex-row gap-6">
      <!-- Sidebar -->
      <div class="w-full lg:w-1/4">
        <div class="bg-(--background-card-color) shadow-lg rounded-xl p-4">
          <ul v-if="userId !== null" class="flex flex-col gap-2">
            <!-- Toggle tema -->
            <li class="flex items-center justify-between p-3 rounded-lg">
              <div class="flex items-center gap-2">
                <component :is="isDarkTheme ? Moon : Sun" :size="18" class="text-(--text-color)" />
                <span class="text-sm font-medium text-(--text-color)">{{ t('controlPanel.darkTheme') }}</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" :checked="isDarkTheme" class="sr-only peer" @change="toggleTheme()">
                <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[var(--primary-color)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </li>

            <!-- Opciones del menú -->
            <li
              v-for="opt in options"
              :key="opt.key"
              class="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
              :class="option === opt.key ? 'bg-(--secondary-color) text-white' : 'text-(--text-color) hover:bg-(--text-button-color)'"
              @click="handleOptionClick(opt.key)"
            >
              <div class="flex items-center gap-3">
                <component :is="opt.icon" :size="18" />
                <span class="text-sm font-medium">{{ opt.label }}</span>
              </div>
              <ChevronRight :size="16" />
            </li>

            <!-- Cerrar sesión -->
            <li
              class="flex items-center justify-between p-3 rounded-lg text-(--primary-color) hover:bg-(--text-button-color) transition-colors cursor-pointer mt-2 pt-4"
              @click="handleLogout"
            >
              <div class="flex items-center gap-3">
                <LogOut :size="18" />
                <span class="text-sm font-medium">{{ t('controlPanel.logout') }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 bg-(--background-card-color) shadow-lg rounded-xl p-6">
        <UpdateProfileComponent :profile="profile" v-if="option === 'modificarPerfil'" />
        <ProfileSubscriptionComponent v-else-if="option === 'miSuscripcion'" />
        <PublishedSpacesComponent v-else-if="option === 'espaciosPublicados'" />
        <FavoritesComponent v-else-if="option === 'espaciosFavoritos'" />
        <SupportComponent v-else-if="option === 'soporte'" />
        <ReportsMadeComponent v-else-if="option === 'reportesRealizados'" />
        <SubscriptionsManagementComponent
          v-else-if="option === 'gestionDeSuscripciones' && userId === 1"
        />
      </div>
    </div>
  </main>
  <FooterComponent />
</template>
