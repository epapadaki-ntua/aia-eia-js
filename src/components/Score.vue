<template>
  <b-container class="sticky">
    <b-row :class="alertclass" :no-gutters="true" v-if="!isMobile()">
      <b-col>{{ $t("riskLevel", locale) }}: {{ score[3] }}</b-col>
      <b-col>{{ $t("currentScore", locale) }}: {{ score[2] }}</b-col>
      <b-col>{{ $t("rawRiskScore", locale) }}: {{ score[0] }}</b-col>
      <b-col>{{ $t("mitigationScore", locale) }}: {{ score[1] }}</b-col>
    </b-row>
    <b-row :class="alertclass" :no-gutters="true" v-if="isMobile()">
      <b-col>{{ $t("IL") }}: {{ score[3] }}</b-col>
      <b-col>{{ $t("CS") }}: {{ score[2] }}</b-col>
      <b-col>{{ $t("RS") }}: {{ score[0] }}</b-col>
      <b-col>{{ $t("MS") }}: {{ score[1] }}</b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const score = computed(() => {
  return store.getters.calcScore;
});

const alertclass = computed(() => {
  const scoreValue = score.value[3];
  if (scoreValue === undefined || scoreValue === 1) return "scoreClass alert alert-success";
  if (scoreValue === 2) return "scoreClass alert alert-info";
  if (scoreValue === 3) return "scoreClass alert alert-warning";
  if (scoreValue === 4) return "scoreClass alert alert-danger";
});

const locale = defineProps<{
  locale: any;
}>();
</script>

<style>
.scoreClass {
  font-size: 0.8em !important;
  display: flex !important;
}
.sticky {
  position: -webkit-sticky; /* Safari */
  position: sticky;
  bottom: 0;
}
</style>
