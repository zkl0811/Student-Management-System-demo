//main entrance of the site, render Vue template to page
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import './permission.js';
Vue.use(ElementUI);
Vue.config.productionTip = process.env.NODE_ENV === 'production';

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
