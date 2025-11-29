<script setup>
import { watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ProfileResponse } from '../model/profile.response';
import EditableProfileField from './EditableProfileField.component.vue';
import { ProfilesApiService } from '../services/profiles-api.service';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { ProfileRequest } from '../model/profile.request';
import { Save, Loader2, User, Phone, CreditCard, Calendar, Building2 } from 'lucide-vue-next';

const { t } = useI18n();

const props = defineProps({
  profile: Object,
});

const profileResponse = ref(null);
const profilesApiService = new ProfilesApiService();
const authenticationStore = useAuthenticationStore();
const isLoaded = ref(false);

watch(
  () => props.profile,
  (newVal) => {
    if (newVal && Object.keys(newVal).length) {
      profileResponse.value = new ProfileResponse(newVal);
      isLoaded.value = true;
    }
  },
  { immediate: true }
);

const updateProfile = async () => {
  const profileRequest = new ProfileRequest(profileResponse.value);
  await profilesApiService.update(authenticationStore.userId, profileRequest);
  alert(t('updateProfile.profileUpdated'));
};

</script>

<template>
  <div v-if="isLoaded" class="w-full p-4 flex flex-col gap-4">
    <div class="text-center mb-2">
      <div class="flex items-center justify-center gap-2 mb-1">
        <div class="bg-(--primary-color) rounded-full p-2">
          <User :size="24" class="text-white" />
        </div>
      </div>
      <h2 class="text-xl md:text-3xl font-bold text-(--text-color)">
        {{ t('updateProfile.welcome') }} {{ profileResponse.fullName }}
      </h2>
      <p class="text-(--text-color) text-sm mt-1">{{ t('updateProfile.customizeInfo') }}</p>
    </div>

    <!-- Información Personal -->
    <div class="bg-(--background-card-color) rounded-xl shadow-lg p-4">
      <div class="flex items-center gap-2 mb-4">
        <User :size="20" class="text-(--primary-color)" />
        <h3 class="text-lg font-bold text-(--text-color)">{{ t('updateProfile.personalInfo') }}</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableProfileField
          v-model="profileResponse.name"
          :label="t('updateProfile.name')"
        />
        <EditableProfileField
          v-model="profileResponse.fatherName"
          :label="t('updateProfile.fatherName')"
        />
        <EditableProfileField
          v-model="profileResponse.motherName"
          :label="t('updateProfile.motherName')"
        />
        <EditableProfileField
          v-model="profileResponse.dateOfBirth"
          :label="t('updateProfile.dateOfBirth')"
        />
      </div>
    </div>

    <!-- Información de Contacto y Bancaria -->
    <div class="bg-(--background-card-color) rounded-xl shadow-lg p-4">
      <div class="flex items-center gap-2 mb-4">
        <Phone :size="20" class="text-(--primary-color)" />
        <h3 class="text-lg font-bold text-(--text-color)">{{ t('updateProfile.contactInfo') }}</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <EditableProfileField
          v-model="profileResponse.phone"
          :label="t('updateProfile.phone')"
        />
        <EditableProfileField
          v-model="profileResponse.documentNumber"
          :label="t('updateProfile.documentNumber')"
        />
      </div>

      <div class="flex items-center gap-2 mb-4 pt-4 border-t-2 border-(--text-button-color)">
        <Building2 :size="20" class="text-(--primary-color)" />
        <h3 class="text-lg font-bold text-(--text-color)">{{ t('updateProfile.bankInfo') }}</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableProfileField
          v-model="profileResponse.bankAccountNumber"
          :label="t('updateProfile.bankAccount')"
        />
        <EditableProfileField
          v-model="profileResponse.interbankAccountNumber"
          :label="t('updateProfile.interbankAccount')"
        />
      </div>
    </div>

    <!-- Botón Guardar -->
    <button
      type="button"
      @click="updateProfile"
      class="bg-(--secondary-color) hover:bg-(--secondary-color-hover) transition text-white p-3 rounded-lg hover:cursor-pointer flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
    >
      <Save :size="20" />
      {{ t('updateProfile.saveChanges') }}
    </button>
  </div>
  <div v-else class="w-full p-4 flex flex-col justify-center items-center gap-4">
    <Loader2 :size="48" class="text-(--primary-color) animate-spin" />
    <p class="text-(--text-color) text-xl">{{ t('updateProfile.loadingProfile') }}</p>
  </div>
</template>
