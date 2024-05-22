<template>
  <div class="requirements">
    <div class="container-fluid">
      <div class="row">
        <h2 id="obligations">
          {{ $t("requirements.title", locale) }} {{ score[3] }}
        </h2>
      </div>
      <div
        class="row"
        v-for="requirement in (<unknown>$t('requirements.elements', locale) as Array<any>)"
        :key="requirement.title"
      >
        <h3>{{ requirement.title }}</h3>
        <ListItem :text="requirement.elements[score[3] - 1].text" />
      </div>
      <div class="row">
        <h3>{{ $t("otherRequirementsTitle", locale) }}</h3>
        <p>{{ $t("otherRequirements", locale) }}</p>
        <p>
          <a :href="$t('linkDirective', locale)" target="_blank">
            {{ $t("linkDirectiveText", locale) }}
          </a>
        </p>
        <p>{{ $t("contactAtipForPia", locale) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import ListItem from "@/components/ListItem.vue";
import store from "@/store";

const { locale } = defineProps<{
  locale: any;
}>();

const score = store.getters.calcScore;
</script>
