<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

import NavbarComponent from '../../public/components/Navbar.component.vue';
import CommentCardComponent from '../components/CommentCard.component.vue';

import { CommentsApiService } from '../services/comments-api.service';
import FooterComponent from '../../public/components/Footer.component.vue';
import { MessageSquare } from 'lucide-vue-next';

const { t } = useI18n();

const route = useRoute();
const comments = ref([]);
const commentsApiService = new CommentsApiService();
const isLoaded = ref(false);

onMounted(async() => {
  const localId = parseInt(route.params.localId);
  comments.value = await commentsApiService.getAllByLocalId(localId);
  isLoaded.value = true;
})
</script>

<template>
  <NavbarComponent />
  <main class="px-4 sm:px-8 md:px-10 lg:px-16 py-10 w-full min-h-[80dvh] bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-3">
        <div class="bg-emerald-500 rounded-full p-3">
          <MessageSquare :size="28" class="text-white" />
        </div>
        <h1 class="text-4xl font-bold text-gray-800">{{ t('commentsPage.title') }}</h1>
      </div>
      <p v-if="isLoaded" class="text-gray-600 mt-2 ml-14">{{ comments.length }} {{ comments.length === 1 ? t('commentsPage.comment') : t('commentsPage.comments') }}</p>
    </div>

    <template v-if="isLoaded">
      <div v-if="comments.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CommentCardComponent v-for="comment in comments" :key="comment.id" :comment="comment" />
      </div>
      <div v-else class="flex flex-col items-center justify-center py-20 gap-4">
        <MessageSquare :size="64" class="text-gray-400" />
        <h2 class="text-2xl font-semibold text-gray-700">{{ t('commentsPage.noComments') }}</h2>
        <p class="text-gray-500">{{ t('commentsPage.beFirst') }}</p>
      </div>
    </template>

  </main>
  <FooterComponent />
</template>
