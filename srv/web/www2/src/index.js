import Vue from 'vue'
import Public from './Public.vue'

Vue.config.productionTip = false
Vue.config.devtools = true


new Vue({
  render: h => h(Public)
}).$mount('#app')
