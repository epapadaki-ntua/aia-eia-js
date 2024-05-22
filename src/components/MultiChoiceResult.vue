<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale === undefined">{{ num + '. ' + data.title }}</strong>
      <strong v-else>{{ num + '. ' + data.titleData[locale] }}</strong>
      <br />
      <div v-for="(str, index) in data.value" :key="index">
        <div class="row">
          <div class="col-md-12 list-item valueResultPDF">
            {{ getItemLabel(str, index) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const { data, locale, num } = defineProps<{
  data: any;
  locale: any;
  num: number;
}>();

const getItemLabel = (str: string, index: any): string => {
  if (locale === undefined) {
    const matches = data.data.filter((item: any) => item.value === str);
    if (matches.length === 0) return 'ERROR: No Matches found';
    return matches[0].displayValue;
  } else {
    let choiceValue = data.data[index].displayValue;
    let returnValue = '';
    let localePass = locale;
    data.choiceData.forEach((choice: any) => {
      if (choice.en === choiceValue || choice.fr === choiceValue) {
        returnValue = choice[localePass];
      }
    });
    return returnValue;
  }
};
</script>
