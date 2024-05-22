<template>
  <div class="home">
    <h1>{{ $t("appTitle") }}</h1>
    <p>
      <a
        class="btn btn-default pull-right"
        role="button"
        :href="$t('linkProjectAnchor')"
      >
        {{ $t("linkProjectText") }}
      </a>
    </p>

    <div class="alert alert-info">
      <p class="small">{{ $t("localSaveWarning") }}</p>
    </div>

    <form>
      <ActionButtonBar
        @fileLoaded="fileLoaded"
        @startAgain="startAgain"
        :survey="Survey"
      />
    </form>

    <DropDown :survey="Survey" :displayDropDown="allowDropdown" />
    <br />
    <AssessmentTool :survey="Survey" />
    <Score locale="en" />

    <HelpModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import * as SurveyVue from "survey-vue";
import DropDown from "@/components/DropDown.vue";
import AssessmentTool from "@/components/AssessmentTool.vue";
import Score from "@/components/Score.vue";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import HelpModal from "@/components/HelpModal.vue";
import SurveyFile from "@/interfaces/SurveyFile";
import surveyJSON from "@/survey-enfr.json";
import store from "@/store";
import { useI18n } from "vue-i18n";
import showdown from "showdown";

SurveyVue.Serializer.addProperty("question", "help:text");

const Survey = new SurveyVue.Model(surveyJSON);
let allowDropdown = false;

const router = useRouter();
const { t } = useI18n({});

const startAgain = () => {
  Survey.clear(true, true);
  window.localStorage.clear();
  store.commit("resetSurvey");
  //Resets toggle back to false
  allowDropdown = false;
};

const fileLoaded = (event: SurveyFile) => {
  Survey.version = event.version;
  Survey.data = event.data;
  Survey.currentPageNo = event.currentPage;
  Survey.translationsOnResult = event.translationsOnResult;
  Survey.start();
  store.commit("updateResult", Survey);
};

onMounted(() => {
  // Accounts for user's pressing the back button after completing survey (otherwise next button would appear on the last page)
  Survey.onAfterRenderQuestion.add((result) => {
    store.commit("updateResult", result);
  });

  Survey.onComplete.add((result) => {
    store.commit("updateResult", result);
    router.push("Results");
  });

  Survey.onAfterRenderPage.add((result) => {
    var progressBar = document.getElementsByClassName("progress-bar")[0];
    //Make sure that the current page is 0 and the progress bar is defined and displayed on the screen
    if (result.currentPageNo == 0 && progressBar != undefined) {
      progressBar.innerHTML = "Page 1 " + t("pageProgressBar");
    }
    //Increment the current page by one
    else {
      if (progressBar.innerHTML != undefined) {
        progressBar.innerHTML =
          "Page " + (result.currentPageNo + 1) + t("pageProgressBar");
      }
    }
    //Checks to see weather item1 = Design or item2 = implementation is checked
    //If so then we change boolean to true and pass that parameter to DropDown.vue to check.
    if (Survey.getValue("projectDetailsPhase") != undefined) {
      allowDropdown = true;
    }
  });

  Survey.onValueChanged.add((result) => {
    store.commit("updateResult", result);
    if (Survey.getValue("projectDetailsPhase") != undefined) {
      allowDropdown = true;
    }
  });

  const converter = new showdown.Converter();

  Survey.onTextMarkdown.add((survey, options) => {
    //convert the markdown text to html
    var str = converter.makeHtml(options.text);
    //remove root paragraphs <p></p>
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
    //set html
    options.html = str;
  });

  // Set locale
  Survey.locale = "en";

  // Remove the default required '*'.
  Survey.requiredText = "";

  // Fix all the question labels as they're using <H5> instead of <label>
  // as SurveyJS has open issue as per: https://github.com/surveyjs/surveyjs/issues/928
  Survey.onAfterRenderQuestion.add((sender, options) => {
    let title = options.htmlElement.getElementsByTagName("H5")[0];
    let helpButton = "";

    if (title) {
      var questionRequiredHTML = "";

      if (options.question.isRequired) {
        // Should do localization mechanism
        var requiredText = sender.locale == "fr" ? "obligatoire" : "required";
        questionRequiredHTML =
          ' <strong class="required">(' + requiredText + ")</strong>";
      }

      if (options.question.help) {
        let helpTxt =
          sender.locale == "fr"
            ? String(options.question.help.fr)
            : String(options.question.help.default);
        helpTxt = helpTxt
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "ooooo")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\(/g, "&#40;")
          .replace(/\)/g, "&#41;");
        let showHelpTxt = t("showHelp").toString();
        helpButton = ` <a role="button" onclick="showHelp('${helpTxt}')"><img src="img/icons/show-help.png" alt="${showHelpTxt}"></a>`;
      }
      title.outerHTML =
        '<label for="' +
        options.question.inputId +
        '" class="' +
        title.className +
        '"><span class="field-name">' +
        title.innerHTML +
        "</span>" +
        questionRequiredHTML +
        "</label>" +
        helpButton;
    }
  });

  //if survey is in progress reload from store
  if (store.getters.inProgress) {
    fileLoaded({
      version: store.state.version,
      currentPage: store.state.currentPageNo,
      data: store.state.toolData,
      translationsOnResult: store.state.translationsOnResult,
    } as SurveyFile);
  }
});
</script>
