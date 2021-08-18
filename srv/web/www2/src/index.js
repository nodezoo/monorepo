import Vue from 'vue'
import VueRouter from 'vue-router'

import Public from './Public.vue'
import PublicHome from '@/components/PublicHome.vue'
import ForgotPassView from '@/components/ForgotPassView.vue'
import ResetPassView from '@/components/ResetPassView.vue'


Vue.config.productionTip = false
Vue.config.devtools = true


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: PublicHome
    },
    {
      path: '/forgot',
      component: ForgotPassView
    },
    {
      path: '/resetpass',
      component: ResetPassView
    }
  ],
})


new Vue({
  router,
  render: h => h(Public)
}).$mount('#app')

