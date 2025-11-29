<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Mail, Phone, MessageCircle, Send, HelpCircle } from 'lucide-vue-next';

const { t } = useI18n();

const message = ref('');
const subject = ref('');
const isSending = ref(false);

const sendMessage = async () => {
  if (!subject.value.trim() || !message.value.trim()) {
    alert(t('support.contactForm.errorMessage'));
    return;
  }

  isSending.value = true;

  setTimeout(() => {
    alert(t('support.contactForm.successMessage'));
    subject.value = '';
    message.value = '';
    isSending.value = false;
  }, 1000);
};
</script>

<template>
  <div class="w-full p-4 flex flex-col gap-8">
    <h2 class="text-xl md:text-4xl font-bold text-center mb-6 text-(--text-color)">
      {{ t('support.title') }}
    </h2>

    <!-- Información de contacto -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-(--background-card-color) rounded-xl shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-(--primary-color) rounded-full p-3">
            <Mail :size="24" class="text-white" />
          </div>
          <h3 class="text-xl font-bold text-(--text-color)">{{ t('support.email.title') }}</h3>
        </div>
        <p class="text-(--text-color)">{{ t('support.email.description') }}</p>
        <a href="mailto:info@alquilafacil.com" class="text-(--primary-color) hover:text-(--primary-color-hover) font-semibold">
          info@alquilafacil.com
        </a>
      </div>

      <div class="bg-(--background-card-color) rounded-xl shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="bg-(--secondary-color) rounded-full p-3">
            <Phone :size="24" class="text-white" />
          </div>
          <h3 class="text-xl font-bold text-(--text-color)">{{ t('support.phone.title') }}</h3>
        </div>
        <p class="text-(--text-color)">{{ t('support.phone.description') }}</p>
        <a href="tel:+51991042243" class="text-(--secondary-color) hover:text-(--secondary-color-hover) font-semibold">
          +51 991 042 243
        </a>
      </div>
    </div>

    <!-- Formulario de contacto -->
    <div class="bg-(--background-card-color) rounded-xl shadow-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-(--primary-color) rounded-full p-3">
          <MessageCircle :size="24" class="text-white" />
        </div>
        <h3 class="text-2xl font-bold text-(--text-color)">{{ t('support.contactForm.title') }}</h3>
      </div>

      <form @submit.prevent="sendMessage" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-(--text-color) font-semibold">{{ t('support.contactForm.subjectLabel') }}</label>
          <input
            v-model="subject"
            type="text"
            :placeholder="t('support.contactForm.subjectPlaceholder')"
            class="p-3 border-2 border-gray-300 rounded-lg focus:border-(--primary-color) focus:outline-none bg-(--background-card-color) text-(--text-color)"
            required
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-(--text-color) font-semibold">{{ t('support.contactForm.messageLabel') }}</label>
          <textarea
            v-model="message"
            :placeholder="t('support.contactForm.messagePlaceholder')"
            rows="6"
            class="p-3 border-2 border-gray-300 rounded-lg focus:border-(--primary-color) focus:outline-none bg-(--background-card-color) text-(--text-color) resize-none"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="isSending"
          class="bg-(--primary-color) hover:bg-(--primary-color-hover) text-white p-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send :size="20" />
          {{ isSending ? t('common.sending') : t('support.contactForm.submitButton') }}
        </button>
      </form>
    </div>

    <!-- Preguntas frecuentes -->
    <div class="bg-(--background-card-color) rounded-xl shadow-lg p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="bg-(--secondary-color) rounded-full p-3">
          <HelpCircle :size="24" class="text-white" />
        </div>
        <h3 class="text-2xl font-bold text-(--text-color)">{{ t('support.faq.title') }}</h3>
      </div>

      <div class="flex flex-col gap-4">
        <details class="group bg-(--text-button-color) rounded-lg overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 hover:opacity-80 transition-opacity">
            <span class="font-semibold text-(--text-color)">{{ t('support.faq.q1.question') }}</span>
            <span class="text-(--text-color) group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="px-4 pb-4 text-(--text-color) leading-relaxed">
            {{ t('support.faq.q1.answer') }}
          </p>
        </details>

        <details class="group bg-(--text-button-color) rounded-lg overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 hover:opacity-80 transition-opacity">
            <span class="font-semibold text-(--text-color)">{{ t('support.faq.q2.question') }}</span>
            <span class="text-(--text-color) group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="px-4 pb-4 text-(--text-color) leading-relaxed">
            {{ t('support.faq.q2.answer') }}
          </p>
        </details>

        <details class="group bg-(--text-button-color) rounded-lg overflow-hidden">
          <summary class="flex items-center justify-between cursor-pointer p-4 hover:opacity-80 transition-opacity">
            <span class="font-semibold text-(--text-color)">{{ t('support.faq.q3.question') }}</span>
            <span class="text-(--text-color) group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="px-4 pb-4 text-(--text-color) leading-relaxed">
            {{ t('support.faq.q3.answer') }}
          </p>
        </details>
      </div>
    </div>
  </div>
</template>
