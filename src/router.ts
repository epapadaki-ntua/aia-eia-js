import { createRouter, createWebHashHistory } from 'vue-router'

import Results from './views/Results.vue';
import Home from './views/Home.vue';

export default createRouter({
    // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
    history: createWebHashHistory(),
    routes: [
        {
          path: "/",
          name: "home",
          component: Home
        },
        {
          path: "/Results",
          name: "results",
          component: Results
        }
      ],
  })