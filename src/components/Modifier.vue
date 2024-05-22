<template>
  <div>
    <div v-if="locale === undefined">
      <strong>{{ $t("modifier") }}:</strong> {{ str }}
    </div>
    <div v-else class="modifierPDF">
      [ {{ $t("modifier", locale) }}: {{ str }} ]
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const { data, locale } = defineProps<{
  data: any;
  locale: any;
}>();

let str: string = getModifiedData();

function getModifiedData(): string {
  // Added similar logic than parseEmbeddedValue from $store
  if (typeof data === "string") {
    const lastHyphenIdx = data.lastIndexOf("-");
    if (lastHyphenIdx !== -1) {
      // Suffix after last "-" could be a number.
      const possibleValue = data.substring(lastHyphenIdx + 1);
      const value = Number(possibleValue);
      if (typeof value === "number") {
        return "+" + value.toString();
      }
    }
    return "0";
  }
  if (data == 0) return "0";
  if (data < 0) return data.toString();
  return "+" + data;
}
</script>
