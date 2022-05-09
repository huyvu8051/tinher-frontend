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

import Cloudinary from 'cloudinary-vue';

Vue.use(Cloudinary, {
  configuration: {
    cloudName: "bobvu-it",
    components: [ "CldImage" ]
  }
});


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


// sweet
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
Vue.use(VueSweetalert2);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  vuetify,
  components: { App },
  template: '<App/>'
})
