// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import EventBus from "@/EventBus"

import Nofication from "./plugins/Nofication"
import store from '@/store/store'

import GlobalComponents from "./plugins/GlobalComponents"

import vuetify from './plugins/vuetify'


Vue.config.productionTip = false

Vue.use(Nofication);

Vue.use(GlobalComponents);
Vue.prototype.$eventBus = EventBus;

import GoogleAuth from '@/plugins/GoogleOauth2.js'

const gauthOption = {
  clientId: '735007599200-u6q67j2t8999cflp03b0jovvatal4mbh.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

Vue.use(GoogleAuth, gauthOption)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>'
})
