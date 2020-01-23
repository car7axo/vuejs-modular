import Vue from 'vue';
import App from './App.vue';
import VueModules from './plugins/modules';
import { router, store } from './bootstrap';
import modules from './config/modules';

Vue.use(VueModules, { modules, store, router });

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
