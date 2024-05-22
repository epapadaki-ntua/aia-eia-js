<template>
  <div>
    <!--<h2>Assessment Tool</h2>-->
    <div id="surveyContainer" class="wb-frmvld">
      <survey :survey="survey"></survey>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Model } from 'survey-vue';
import showdown from 'showdown';

const survey = defineProps<{
  survey: Model;
}>()

const converter = new showdown.Converter();

survey.survey.onTextMarkdown.add(function(survey, options) {
  //convert the markdown text to html
  var str = converter.makeHtml(options.text);
  //remove root paragraphs <p></p>
  str = str.substring(3);
  str = str.substring(0, str.length - 4);
  //set html
  options.html = str;
});
</script>
