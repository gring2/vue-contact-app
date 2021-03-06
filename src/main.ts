import axios from "axios";
import Vue from "vue";
// @ts-ignore
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");

export const VueApp = Vue
