import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    version: "v0.10.0",
    answerData: [],
    result: undefined,
    currentPageNo: 0,
    toolData: {},
    translationsOnResult: {},
    questionNames: [],
    removeNext: false,
    removePrev: false
  }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}