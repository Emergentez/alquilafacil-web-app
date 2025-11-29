<script setup>
import { useI18n } from 'vue-i18n';
import { Mail, Phone, Facebook, Twitter } from 'lucide-vue-next';

const { t } = useI18n();
</script>

<template>
  <footer class="w-full py-10 px-5 sm:px-10 lg:px-32 bg-(--primary-color)">
    <div class="max-w-7xl mx-auto text-white">
      <div class="flex flex-col sm:flex-row justify-around gap-8 mb-8">
        <!-- Contacto -->
        <div>
          <h3 class="text-xl font-bold mb-4">{{ t('footer.contact') }}</h3>
          <div class="flex flex-col gap-3">
            <a href="mailto:info@alquilafacil.com" class="flex items-center gap-2 hover:text-(--secondary-color) transition-colors">
              <Mail :size="20" />
              <span>info@alquilafacil.com</span>
            </a>
            <a href="tel:+51991042243" class="flex items-center gap-2 hover:text-(--secondary-color) transition-colors">
              <Phone :size="20" />
              <span>+51 991 042 243</span>
            </a>
          </div>
        </div>

        <!-- Redes sociales -->
        <div>
          <h3 class="text-xl font-bold mb-4">{{ t('footer.followUs') }}</h3>
          <div class="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61566546191657"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-(--secondary-color) transition-colors"
            >
              <Facebook :size="28" />
            </a>
            <a
              href="https://x.com/alquila_facil"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-(--secondary-color) transition-colors"
            >
              <Twitter :size="28" />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="border-t border-white pt-6">
        <p class="text-center text-sm sm:text-base">
          © 2025 {{ t('common.appName') }}. {{ t('footer.rights') }}.
        </p>
        <div class="flex flex-wrap justify-center gap-2 mt-2">
          <a href="https://alquiladorez.github.io/AlquilaFacil-LandingPage/privacy-policy.html" target="_blank" rel="noopener noreferrer" class="hover:text-(--secondary-color) transition-colors text-sm">
            {{ t('footer.privacyPolicy') }}
          </a>
          <span class="text-sm">|</span>
          <a href="https://alquiladorez.github.io/AlquilaFacil-LandingPage/service-terms.html" target="_blank" rel="noopener noreferrer" class="hover:text-(--secondary-color) transition-colors text-sm">
            {{ t('footer.termsAndConditions') }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
