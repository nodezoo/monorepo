import Vue from 'vue'
import VueSession from 'vue-session'
import Public from './Public.vue'

Vue.config.productionTip = false
Vue.config.devtools = true


Vue.use(VueSession)


new Vue({
  render: h => h(Public)
}).$mount('#app')
