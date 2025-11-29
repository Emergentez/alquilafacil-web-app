<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../services/authentication.store';
import { SignInRequest } from '../model/sign-in.request';
import GoogleSignInButtonComponent from '../components/GoogleSignInButton.component.vue';
import FacebookSignInButtonComponent from '../components/FacebookSignInButton.component.vue';
import InputFieldComponent from '../components/InputField.component.vue';
import LanguageSwitcherComponent from '@/shared/components/LanguageSwitcher.component.vue';
import { LogIn, UserPlus, AlertCircle } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authenticationStore = useAuthenticationStore();

const formData = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: '',
  general: ''
});

const signIn = async () => {
  errors.value = {
    email: '',
    password: '',
    general: ''
  };

  if (!formData.value.email) {
    errors.value.email = t('auth.signIn.errors.emailRequired');
  }
  if (!formData.value.password) {
    errors.value.password = t('auth.signIn.errors.passwordRequired');
  }

  if (errors.value.email || errors.value.password) return;

  try {
    const signInRequest = new SignInRequest(formData.value.email, formData.value.password);
    await authenticationStore.signIn(signInRequest, router);
  } catch (error) {
    console.error('Error during sign-in:', error);
    errors.value.general = t('auth.signIn.errors.invalidCredentials');
  }
};

const goToSignUp = () => {
  router.push(`/sign-up`);
};
</script>


<template>
  <section class="bg-(--primary-color) w-full h-[100dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-4 flex flex-col justify-center items-center gap-2">
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcherComponent />
    </div>

    <div class="flex items-center gap-3 mb-2">
      <div class="bg-(--secondary-color) rounded-full p-3">
        <LogIn :size="32" class="text-white" />
      </div>
      <h1 class="text-white text-center text-4xl font-semibold">{{ t('auth.signIn.title') }}</h1>
    </div>

    <form @submit.prevent="signIn" class="flex flex-col gap-4 w-full max-w-160 mx-auto mt-6">
      <InputFieldComponent
        v-model="formData.email"
        :error="errors.email"
        :placeholder="t('auth.signIn.emailPlaceholder')"
        type="email"
        autocomplete="email"
      />
      <InputFieldComponent
        v-model="formData.password"
        :error="errors.password"
        :placeholder="t('auth.signIn.passwordPlaceholder')"
        type="password"
        autocomplete="current-password"
      />
      <button type="submit" class="bg-(--secondary-color) text-white p-4 rounded-lg hover:cursor-pointer hover:bg-(--secondary-color-hover) transition-colors flex items-center justify-center gap-2 font-semibold">
        <LogIn :size="20" />
        {{ t('auth.signIn.submitButton') }}
      </button>

      <div v-if="errors.general" class="bg-red-50 border-2 border-red-200 rounded-lg p-3">
        <p class="text-red-600 text-sm flex items-center justify-center gap-2">
          <AlertCircle :size="16" />
          {{ errors.general }}
        </p>
      </div>

      <p class="text-center text-base text-white mt-2">
        {{ t('auth.signIn.noAccount') }}
      </p>
      <div class="w-full h-0.5 bg-white"></div>
      <button type="button" class="bg-(--secondary-color) text-white p-4 rounded-lg hover:cursor-pointer hover:bg-(--secondary-color-hover) transition-colors flex items-center justify-center gap-2 font-semibold" @click="goToSignUp">
        <UserPlus :size="20" />
        {{ t('auth.signIn.registerButton') }}
      </button>
      <!--
      <p class="text-center text-base text-white">
        {{ t('auth.signIn.orSignInWith') }}
      </p>
      <div class="flex justify-center items-center gap-2">
        <FacebookSignInButtonComponent />
        <GoogleSignInButtonComponent />
      </div>
      -->
    </form>
  </section>
</template>
