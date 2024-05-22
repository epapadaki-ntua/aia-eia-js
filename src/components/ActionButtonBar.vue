<template>
  <div>
    <div v-if="$store.getters.inProgress">
      <ul class="list-inline lst-spaced">
        <li>
          <button
            type="button"
            class="mrgn-bttm-sm btn btn-success"
            @click="saveSurvey"
          >
            {{ $t("saveButton") }}
          </button>
        </li>
        <li>
          <label for="fileChoose" class="btn btn-default">
            {{ $t("jsonFileUpload") }}
          </label>
          <input
            id="fileChoose"
            type="file"
            value="Load"
            accept=".json"
            style="display: none"
            @change="onFileChanged($event)"
          />
        </li>
        <li>
          <button
            type="button"
            value="Start Over"
            class="btn btn-default"
            @click="startModal"
          >
            {{ $t("startAgain") }}
          </button>
        </li>
      </ul>
    </div>
    <div v-else>
      <label for="fileChoose" class="btn btn-default">
        {{ $t("jsonFileUpload") }}
      </label>
      <input
        id="fileChoose"
        type="file"
        value="Load"
        accept=".json"
        style="display: none"
        @change="onFileChanged($event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SurveyFile from "@/interfaces/SurveyFile";
import { Model } from "survey-vue";
import store from "@/store";
import { useI18n } from "vue-i18n";
const { t } = useI18n({});

const emit = defineEmits(["startAgain", "fileLoaded"]);

// make saveJsonFile() declared in index.html available to TS
declare global {
  interface Window {
    saveJsonFile: any;
  }
}

const survey = defineProps<Model>();

const startModal = () => {
  if (confirm(t("alertConfirmRestart").toString())) {
    emit("startAgain");
  }
};

const saveSurvey = () => {
  const saveFile = buildSurveyFile();
  const blob = new Blob([saveFile], { type: "text/plain" });
  window.saveJsonFile("AIA Results.json", blob);
};

const onFileChanged = ($event: any) => {
  if (
    $event === null ||
    $event.target === null ||
    $event.dataTransfer === null
  ) {
    return;
  }

  const target = $event.target as HTMLInputElement;
  const files = target.files || $event.dataTransfer.files;

  if (files.length === 0) {
    return;
  }

  loadSurvey(files[0]);
};

const buildSurveyFile = (): string => {
  return JSON.stringify({
    version: store.state.version,
    currentPage: store.state.currentPageNo,
    data: store.state.toolData,
    translationsOnResult: store.state.translationsOnResult,
  });
};

const loadSurvey = (file: any) => {
  var extension = "";
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent) => {
    const result = reader.result as string;
    if (result === "undefined") {
      return;
    }

    const loadedFile: SurveyFile = JSON.parse(result);
    // little conversion for older files before #622 was implemented
    if ((loadedFile?.data as any)?.aboutSystem1?.includes("item6-1")) {
      const aboutSystem = (loadedFile.data as any).aboutSystem1 as string[];
      aboutSystem[aboutSystem.indexOf("item6-1")] = "item6";
    }
    // another conversion, for when we moved "describe the decision automated" from impact to decision
    if (
      loadedFile?.data !== undefined &&
      "impact4" in (loadedFile.data as any)
    ) {
      const decisionAutomated = (loadedFile.data as any).impact4 as string;
      (loadedFile.data as any).decisionSector3 = decisionAutomated;
      delete (loadedFile.data as any).impact4;

      // also bring over the translation
      if (
        loadedFile.translationsOnResult !== undefined &&
        "impact4" in (loadedFile.translationsOnResult as any)
      ) {
        var translations = loadedFile.translationsOnResult as any;
        translations.decisionSector3 = translations.impact4;
        delete translations.impact4;
      }
    }
    emit("fileLoaded", loadedFile);
  };

  extension = file.name.split(".").pop();

  //Error check to inform users they need to submit a JSON file otherwise it will ask them to submit the correct file type
  if (!extension || extension.toLowerCase() != "json") {
    alert(t("alertNotificationWrongPopUp"));
  }

  reader.readAsText(file);
};
</script>
