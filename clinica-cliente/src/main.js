import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import router from './router'
import store from './store'
import Vuex from 'vuex';

Vue.config.productionTip = false

Vue.use(Vuex);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
