import Vue from 'vue'

import { makeVuetify } from './vuetify/vuetify'
import { makeRouter } from './router/router'
import { makeStore } from './store/store'
import { makeVxg } from './vxg/vxg'

import Account from './Account.vue'

import model from '../model/model.json'


Vue.config.productionTip = false
Vue.config.devtools = true


const store = makeStore(Vue)
const vuetify = makeVuetify(Vue)
const vxg = makeVxg(Vue)


// TODO: should this be here
Vue.prototype.$model = model


import BasicPackageView from './components/PackageView.vue'
import BasicReportView from './components/ReportView.vue'
import BasicProfileView from './components/ProfileView.vue'


const router = makeRouter(Vue, {
  cmp: {
    'basic-package-view': BasicPackageView,
    'basic-report-view': BasicReportView,
    'basic-profile-view': BasicProfileView,
  }
})



const root = new Vue({
  router,
  store,
  vuetify,
  render: h => h(Account)
}).$mount('#app')


window.main = {
  account: root.$children[0],
  root,
  model,
  vxg
}
