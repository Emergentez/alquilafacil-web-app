<script setup>
import { defineProps } from 'vue';
import StarRating from 'vue3-star-ratings';
import { CommentResponse } from '../model/comment.response';
import { User } from 'lucide-vue-next';

const props = defineProps({
  comment: Object
});

const commentResponse = new CommentResponse(props.comment);
</script>

<template>
  <div class="flex items-start shadow-lg rounded-xl p-5 gap-4 text-(--text-color) bg-(--background-card-color) hover:shadow-xl transition-shadow">
    <div class="bg-(--primary-color) min-w-14 h-14 flex justify-center items-center rounded-full shrink-0">
      <User :size="28" class="text-white" />
    </div>
    <div class="flex flex-col w-full gap-3">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span class="text-lg font-bold text-(--text-color)">{{ commentResponse.userUsername }}</span>
        <StarRating
          :model-value="commentResponse.rating"
          :star-color="'#fb9e49'"
          :inactive-color="'#d1d5db'"
          :number-of-stars="5"
          :star-size="20"
          :disable-click="true"
        />
      </div>
      <p class="text-base text-(--text-color) leading-relaxed">{{ commentResponse.text }}</p>
    </div>
  </div>
</template>