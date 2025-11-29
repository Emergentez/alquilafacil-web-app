<script setup>
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import DistrictSearchBarComponent from '@/locals/components/DistrictSearchBar.component.vue';
import LanguageSwitcherComponent from '@/shared/components/LanguageSwitcher.component.vue';
import { PlusCircle, Calendar, Bell, User } from 'lucide-vue-next';

const { t } = useI18n();
</script>

<template>
  <nav class="text-(--navbar-text-color) bg-(--primary-color) w-full h-[10dvh] sticky flex justify-between px-1 sm:px-8 md:px-10 lg:px-16 gap-4 md:gap-6">
    <RouterLink to="/" class="flex items-center gap-2 transition font-semibold">
      <img src="/logo.png" alt="logo" class="min-w-14 h-14" />
      <p class="hidden sm:flex text-2xl">{{ t('common.appName') }}</p>
    </RouterLink>

    <DistrictSearchBarComponent />

    <div class="flex items-center justify-end gap-2">

      <ul class="flex xl:hidden gap-3 text-sm sm:text-base lg:text-xl items-center">
        <li class="transition hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/publish" class="cursor-pointer">
            <PlusCircle :size="28" class="md:w-10 md:h-10" :stroke-width="2" />
          </RouterLink>
        </li>
        <li class="transition hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/calendar" class="cursor-pointer">
            <Calendar :size="28" class="md:w-10 md:h-10" :stroke-width="2" />
          </RouterLink>
        </li>
        <li class="transition hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/notifications" class="cursor-pointer">
            <Bell :size="28" class="md:w-10 md:h-10" :stroke-width="2" />
          </RouterLink>
        </li>
        <li class="transition hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/control-panel" class="cursor-pointer">
            <User :size="28" class="md:w-10 md:h-10" :stroke-width="2" />
          </RouterLink>
        </li>
      </ul>

      <ul class="hidden xl:flex gap-1 lg:gap-2 text-sm sm:text-base lg:text-xl items-center ">
        <li class="transition px-1 lg:px-3 hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/publish" class="cursor-pointer">{{ t('navbar.publish') }}</RouterLink>
        </li>
        <li class="transition px-1 lg:px-3 hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/calendar" class="cursor-pointer">{{ t('navbar.calendar') }}</RouterLink>
        </li>
        <li class="transition px-1 lg:px-3 hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/notifications" class="cursor-pointer">{{ t('navbar.notifications') }}</RouterLink>
        </li>
        <li class="transition px-1 lg:px-3 hover:text-(--navbar-text-color-hover)">
          <RouterLink to="/control-panel" class="cursor-pointer">{{ t('navbar.profile') }}</RouterLink>
        </li>
      </ul>

      <LanguageSwitcherComponent />
    </div>
  </nav>
</template>
