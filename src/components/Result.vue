<template>
  <div>
    <div v-if="data.questionHeader !== undefined && locale !== undefined">
      <h3>{{ data.questionHeader[locale] }}</h3>
    </div>
    <div>
      <component :is="resolveComponentType(data)" :data="data" :locale="locale" :num="num" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, resolveComponent } from 'vue';
import { getValue } from '@/store';

const { data, locale, num } = defineProps<{
  data: any;
  locale: any;
  num: number;
}>();

const resolveComponentType = (data: any) => {
  if (data.value === data.displayValue) {
    return 'TextResult';
  } else if (isMultiChoiceValueResult(data)) {
    return 'MultiChoiceValueResult';
  } else if (Array.isArray(data.value)) {
    return 'MultiChoiceResult';
  } else {
    return 'ValueResult';
  }
};

const isMultiChoiceValueResult = (data: any): boolean => {
  if (!Array.isArray(data.value)) return false;
  return data.value.some((value: any) => getValue(value) > 0);
};
</script>
