<template>
  <div>
    <div class="col-md-12">
      <strong v-if="locale === undefined">{{ num + '. ' + data.title }}</strong>
      <strong v-if="locale !== undefined">{{ num + '. ' + data.titleData[locale] }}</strong>
      <br />
      <div v-if="locale === undefined">
        <div>
          <strong v-if="$i18n.locale === 'en'" class="label label-default">{{ $t('englishContent') }} :</strong>
          <strong v-if="$i18n.locale === 'fr'" class="label label-default">{{ $t('frenchContent') }} :</strong>
          <p>
            <span style="white-space: pre-wrap">{{ data.displayValue }}</span>
          </p>
        </div>
        <div>
          <strong v-if="$i18n.locale === 'en'" class="label label-default">{{ $t('frenchContent') }} :</strong>
          <strong v-if="$i18n.locale === 'fr'" class="label label-default">{{ $t('englishContent') }} :</strong>
          <div>
            <textarea style="width: 100%" v-model="translation" @blur="saveTranslation"></textarea>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="locale === $i18n.locale" class="valueResultPDF">
          <span style="white-space: pre-wrap">{{ data.displayValue }}</span>
        </div>
        <div v-else class="valueResultPDF">
          <span style="white-space: pre-wrap">{{ translations[data.name] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import store from '@/store';

const translation = ref('');

const saveTranslation = () => {
  store.dispatch('saveTranslationsOnResult', {
    key: props.data.name,
    value: translation.value
  });
};

const translations = computed(() => store.getters.getTranslationsOnResult);

const props = defineProps<{
  data: any;
  locale: any;
  num: number;
}>();


</script>
