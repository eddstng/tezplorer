import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store/store";


Vue.config.productionTip = false;

new Vue({
  methods: {
    async init() {
    },
  },
  mounted() {
    this.init();
  },
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
