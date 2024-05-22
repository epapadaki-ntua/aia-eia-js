<template>
  <div v-if="displayDropDown">
    <label> {{ $t("navigateSectionLabel") }} </label>

    <div>
      <b-col md="4">
        <!-- Calls redirectToPage function whenever user changes index -->
        <select class="dropDownList" @change="redirectToPage">
          <option selected disabled>{{ $t("selectSection") }}</option>
          <option v-for="page in totalPages" :key="page.num">
            {{ "Section " + page.num + ": " + page.title }}
          </option>
        </select>
      </b-col>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Model } from "survey-vue";
import { useI18n } from 'vue-i18n';
const {t} = useI18n({})

const displayDropDown = defineProps<boolean>();
const survey = defineProps<Model>();

const totalPages = ref([
  {
    title: t("resultSectionPD"),
    num: 1,
  },
  {
    title: t("sectionBusinessDriverImpact"),
    num: 2,
  },
  {
    title: t("riskProfile"),
    num: 3,
  },
  {
    title: t("projectAuthority"),
    num: 4,
  },
  {
    title: t("aboutTheSystem"),
    num: 5,
  },
  {
    title: t("aboutTheAlgorithm"),
    num: 6,
  },
  {
    title: t("aboutDecision"),
    num: 7,
  },
  {
    title: t("impactAssessment"),
    num: 8,
  },
  {
    title: t("aboutTheData"),
    num: 9,
  },
  {
    title: t("consultations"),
    num: 10,
  },

  {
    title: t("deRiskingAndMitigationMeasuresDQ"),
    num: 11,
  },

  {
    title: t("deRiskingAndMitigationMeasuresPF"),
    num: 12,
  },
  {
    title: t("deRiskingAndMitigationMeasuresP"),
    num: 13,
  },
]);

const redirectToPage = () => {
  const e = document.getElementsByClassName(
    "dropDownList"
  )[0] as HTMLSelectElement;
  const pageSection = e.options[e.selectedIndex].text;
  const newVal = pageSection.replace(/\D/g, "");
  if (survey.value != null) {
    survey.value.currentPageNo = Number(newVal) - 1;
  }
};
</script>
