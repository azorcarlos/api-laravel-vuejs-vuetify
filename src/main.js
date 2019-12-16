import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import '@babel/polyfill'

import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  store,
  icons: {
      iconfont: 'md', // default - only for display purposes
  },
  vuetify,
  render: h => h(App)
}).$mount('#app')
