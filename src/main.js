// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import EventBus from "@/EventBus"

import Nofication from "./plugins/Nofication"
import store from '@/store/store'


import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(Nofication);

Vue.prototype.$eventBus = EventBus;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>'
})
