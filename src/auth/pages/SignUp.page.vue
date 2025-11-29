<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '../services/authentication.store';
import { SignUpRequest } from '../model/sign-up.request';
import GoogleSignUpButtonComponent from '../components/GoogleSignUpButton.component.vue';
import FacebookSignUpButtonComponent from '../components/FacebookSignUpButton.component.vue';
import InputFieldComponent from '../components/InputField.component.vue';
import LanguageSwitcherComponent from '@/shared/components/LanguageSwitcher.component.vue';
import { UserPlus, LogIn, RefreshCw, Shield, AlertCircle } from 'lucide-vue-next';

const { t } = useI18n();
const router = useRouter();
const authenticationStore = useAuthenticationStore();

const checkTermsAndConditions = ref(false);

const formData = ref({
  username: '',
  name: '',
  fatherName: '',
  motherName: '',
  phoneNumber: '',
  documentNumber: '',
  dateOfBirth: '',
  email: '',
  password: '',
  passwordConfirmation: ''
});

const errors = ref({
  username: '',
  name: '',
  fatherName: '',
  motherName: '',
  phoneNumber: '',
  documentNumber: '',
  dateOfBirth: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  general: ''
});

// CAPTCHA
const captchaText = ref('');
const userCaptchaInput = ref('');
const isCaptchaValid = ref(false);

const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  captchaText.value = Array.from({ length: 5 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
  userCaptchaInput.value = '';
  isCaptchaValid.value = false;
};

const validateCaptcha = () => {
  isCaptchaValid.value =
    userCaptchaInput.value.trim().toUpperCase() === captchaText.value;
};

generateCaptcha();

const validatePassword = (password) => {
  const symbols = "!@#$%^&*()_-+=[{]};:>|./?";
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    [...password].some(c => symbols.includes(c))
  );
};

const signUp = async () => {
  Object.keys(errors.value).forEach(k => errors.value[k] = '');

  if (!formData.value.username) errors.value.username = t('auth.signUp.errors.usernameRequired');
  if (!formData.value.name) errors.value.name = t('auth.signUp.errors.nameRequired');
  if (!formData.value.fatherName) errors.value.fatherName = t('auth.signUp.errors.fatherNameRequired');
  if (!formData.value.motherName) errors.value.motherName = t('auth.signUp.errors.motherNameRequired');
  if (!formData.value.phoneNumber) errors.value.phoneNumber = t('auth.signUp.errors.phoneRequired');
  if (!formData.value.documentNumber) errors.value.documentNumber = t('auth.signUp.errors.documentRequired');
  if (!formData.value.dateOfBirth) errors.value.dateOfBirth = t('auth.signUp.errors.birthDateRequired');
  if (!formData.value.email) errors.value.email = t('auth.signUp.errors.emailRequired');
  if (!formData.value.password) errors.value.password = t('auth.signUp.errors.passwordRequired');
  if (!formData.value.passwordConfirmation) errors.value.passwordConfirmation = t('auth.signUp.errors.confirmPasswordRequired');

  if (formData.value.password && !validatePassword(formData.value.password)) {
    errors.value.password = t('auth.signUp.errors.passwordWeak');
  }

  if (
    formData.value.password &&
    formData.value.passwordConfirmation &&
    formData.value.password !== formData.value.passwordConfirmation
  ) {
    errors.value.passwordConfirmation = t('auth.signUp.errors.passwordMismatch');
  }

  if (formData.value.phoneNumber && formData.value.phoneNumber.length < 9) {
    errors.value.phoneNumber = t('auth.signUp.errors.phoneMinLength');
  }

  if (!checkTermsAndConditions.value) {
    errors.value.general = t('auth.signUp.errors.termsRequired');
  }

  if (!isCaptchaValid.value) {
    errors.value.general = t('auth.signUp.errors.captchaInvalid');
  }

  const hasErrors = Object.values(errors.value).some(msg => msg);
  if (hasErrors) return;

  try {
    const signUpRequest = new SignUpRequest(
      formData.value.username,
      formData.value.email,
      formData.value.password,
      formData.value.name,
      formData.value.fatherName,
      formData.value.motherName,
      formData.value.dateOfBirth,
      formData.value.documentNumber,
      formData.value.phoneNumber,
    );
    await authenticationStore.signUp(signUpRequest, router);
  } catch (error) {
    console.error('Error during sign-up:', error);
    errors.value.general = t('auth.signUp.errors.generalError');
  }
};

const goToSignIn = () => {
  router.push(`/sign-in`);
};
</script>

<template>
  <section class="bg-(--primary-color) w-full min-h-[100dvh] px-4 sm:px-8 md:px-10 lg:px-16 py-20 flex flex-col justify-center items-center gap-2">
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4">
      <LanguageSwitcherComponent />
    </div>

    <div class="flex items-center gap-3 mb-2">
      <div class="bg-(--secondary-color) rounded-full p-3">
        <UserPlus :size="32" class="text-white" />
      </div>
      <h1 class="text-white text-center text-4xl font-semibold">{{ t('auth.signUp.title') }}</h1>
    </div>

    <form @submit.prevent="signUp" class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-180 mx-auto mt-6">

      <InputFieldComponent v-model="formData.username" :error="errors.username" :placeholder="t('auth.signUp.usernamePlaceholder')" />
      <InputFieldComponent v-model="formData.name" :error="errors.name" :placeholder="t('auth.signUp.namePlaceholder')"/>
      <InputFieldComponent v-model="formData.fatherName" :error="errors.fatherName" :placeholder="t('auth.signUp.fatherNamePlaceholder')" />
      <InputFieldComponent v-model="formData.motherName" :error="errors.motherName" :placeholder="t('auth.signUp.motherNamePlaceholder')" />
      <InputFieldComponent v-model="formData.phoneNumber" :error="errors.phoneNumber" :placeholder="t('auth.signUp.phonePlaceholder')" type="phone" />
      <InputFieldComponent v-model="formData.documentNumber" :error="errors.documentNumber" :placeholder="t('auth.signUp.documentPlaceholder')" type="phone"/>
      <InputFieldComponent v-model="formData.dateOfBirth"  :error="errors.dateOfBirth"  :placeholder="t('auth.signUp.birthDatePlaceholder')" type="date" />
      <InputFieldComponent v-model="formData.email" :error="errors.email" :placeholder="t('auth.signUp.emailPlaceholder')" type="email" />
      <InputFieldComponent v-model="formData.password" :error="errors.password" :placeholder="t('auth.signUp.passwordPlaceholder')" type="password" />
      <InputFieldComponent v-model="formData.passwordConfirmation" :error="errors.passwordConfirmation" :placeholder="t('auth.signUp.confirmPasswordPlaceholder')" type="password" />

      <!-- CAPTCHA -->
      <div class="md:col-span-2 flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Shield :size="20" class="text-white" />
          <label class="text-white text-lg font-semibold">{{ t('auth.signUp.captcha.title') }}</label>
        </div>

        <div class="bg-gray-200 text-black font-mono text-2xl text-center py-4 rounded-lg tracking-widest select-none">
          {{ captchaText }}
        </div>

        <input
          v-model="userCaptchaInput"
          @input="validateCaptcha"
          :placeholder="t('auth.signUp.captcha.placeholder')"
          class="p-3 rounded-lg border-2 border-white text-center text-white bg-transparent focus:outline-none focus:border-(--secondary-color)"
        />

        <div v-if="userCaptchaInput && !isCaptchaValid" class="bg-red-50 border-2 border-red-200 rounded-lg p-2">
          <p class="text-red-600 text-sm flex items-center justify-center gap-2">
            <AlertCircle :size="14" />
            {{ t('auth.signUp.captcha.invalid') }}
          </p>
        </div>

        <button type="button" @click="generateCaptcha" class="text-white text-sm flex items-center justify-center gap-2 hover:text-(--secondary-color) transition-colors">
          <RefreshCw :size="16" />
          {{ t('auth.signUp.captcha.regenerate') }}
        </button>
      </div>

      <!-- Checkbox -->
      <div class="flex items-center w-full md:col-span-2 gap-4">
        <input type="checkbox" v-model="checkTermsAndConditions" class="w-8 h-8" required />
        <label class="text-white">
          {{ t('auth.signUp.termsText') }} <a href="https://alquiladorez.github.io/AlquilaFacil-LandingPage/service-terms.html"  target="_blank" class="font-bold">{{ t('auth.signUp.termsLink') }}</a> {{ t('auth.signUp.andText') }} <a href="https://alquiladorez.github.io/AlquilaFacil-LandingPage/privacy-policy.html"  target="_blank" class="font-bold">{{ t('auth.signUp.privacyLink') }}</a>.
        </label>
      </div>

      <!-- Botón -->
      <button type="submit" class="bg-(--secondary-color) text-white p-4 rounded-lg hover:cursor-pointer hover:bg-(--secondary-color-hover) transition-colors md:col-span-2 flex items-center justify-center gap-2 font-semibold">
        <UserPlus :size="20" />
        {{ t('auth.signUp.submitButton') }}
      </button>

      <div v-if="errors.general" class="bg-red-50 border-2 border-red-200 rounded-lg p-3 md:col-span-2">
        <p class="text-red-600 text-sm flex items-center justify-center gap-2">
          <AlertCircle :size="16" />
          {{ errors.general }}
        </p>
      </div>

      <p class="text-center text-base text-white md:col-span-2 mt-2">
        {{ t('auth.signUp.hasAccount') }}
      </p>

      <div class="w-full h-0.5 bg-white md:col-span-2"></div>

      <button type="button" class="bg-(--secondary-color) text-white p-4 rounded-lg hover:cursor-pointer hover:bg-(--secondary-color-hover) transition-colors md:col-span-2 flex items-center justify-center gap-2 font-semibold" @click="goToSignIn">
        <LogIn :size="20" />
        {{ t('auth.signUp.loginButton') }}
      </button>
      <!--
      <p class="text-center text-base text-white md:col-span-2">
        {{ t('auth.signUp.orRegisterWith') }}
      </p>

      <div class="flex justify-center items-center gap-2 md:col-span-2">
        <FacebookSignUpButtonComponent />
        <GoogleSignUpButtonComponent />
      </div>
      -->
    </form>
  </section>
</template>

<style scoped>
input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  background-color: var(--primary-color);
  border: 2px solid var(--secondary-color);
  border-radius: 3px;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: var(--secondary-color);
  border: 2px solid var(--primary-color);
  appearance: auto;
  accent-color: var(--secondary-color);
}
</style>
