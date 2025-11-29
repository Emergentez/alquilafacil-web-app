<script setup>
import StarRating from 'vue3-star-ratings';
import { useI18n } from 'vue-i18n';
import { CommentsApiService } from '../services/comments-api.service';
import { useAuthenticationStore } from '../../auth/services/authentication.store';
import { useRouter } from 'vue-router';
import { CommentRequest } from '../model/comment.request';
import { ref } from 'vue';
import { MessageSquare, Send, Star as StarIcon } from 'lucide-vue-next';

const { t } = useI18n();

const props = defineProps({
  localId: Number
});

const commentsApiService = new CommentsApiService();
const authenticationStore = useAuthenticationStore();
const router = useRouter();
const text = ref('');
const rating = ref(0);

const publishComment = async () => {
  try {
    const commentRequest = new CommentRequest({
    userId: authenticationStore.userId,
    localId: props.localId,
    text: text.value,
    rating: Math.floor(rating.value)
  });
    await commentsApiService.create(commentRequest);
    alert(t('createComment.success'));
    router.push(`/comments/${props.localId}`);
  } catch (error) {
    alert(t('createComment.error'));
  }
};

</script>
<template>
  <div class="flex flex-col w-full gap-6 mt-6 bg-(--background-card-color) p-6 rounded-xl shadow-lg">
    <div class="flex items-center gap-3">
      <div class="bg-(--primary-color) rounded-full p-3">
        <MessageSquare :size="24" class="text-white" />
      </div>
      <h3 class="text-2xl font-bold text-(--text-color)">{{ t('createComment.title') }}</h3>
    </div>

    <div class="flex flex-col gap-2">
      <label for="commentText" class="text-base font-semibold text-(--text-color)">{{ t('createComment.writeLabel') }}</label>
      <textarea
        id="commentText"
        v-model="text"
        :placeholder="t('createComment.placeholder')"
        class="w-full p-4 border-2 border-gray-300 rounded-lg resize-y min-h-[120px] text-(--text-color) bg-(--background-card-color) focus:border-(--primary-color) focus:outline-none"
      ></textarea>
    </div>

    <div class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <StarIcon :size="20" class="text-(--secondary-color)" />
        <label class="text-base font-semibold text-(--text-color)">{{ t('createComment.rating') }}</label>
      </div>
      <StarRating
        v-model="rating"
        :max-rating="5"
        :increment="1"
        :star-size="36"
        inactive-color="#d1d5db"
        active-color="#fbbf24"
      />
    </div>

    <button
      @click="publishComment"
      class="bg-(--secondary-color) hover:bg-(--secondary-color-hover) rounded-lg py-4 text-white text-lg font-semibold hover:cursor-pointer transition-colors flex items-center justify-center gap-2"
    >
      <Send :size="20" />
      {{ t('createComment.publishButton') }}
    </button>
  </div>
</template>
