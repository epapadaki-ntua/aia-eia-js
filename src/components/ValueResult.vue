<template>
  <div>
    <div class="col-md-10">
      <strong v-if="locale === undefined">{{ num + '. ' + data.title }}</strong>
      <strong v-if="locale !== undefined">{{ num + '. ' + data.titleData[locale] }}</strong>
      <br />
      <div v-if="locale === undefined" class="valueResultPDF">
        {{ data.displayValue }}
      </div>
      <div v-else class="valueResultPDF">
        {{ data.selectedItem[locale] }}
      </div>
    </div>
    <div v-if="!data.name.endsWith('-NS')" class="col-md-2">
      <Modifier :data="data.value" :locale="locale" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import Modifier from '@/components/Modifier.vue';

const props = defineProps<{
  data: any;
  locale: any;
  num: number;
}>();
</script>
