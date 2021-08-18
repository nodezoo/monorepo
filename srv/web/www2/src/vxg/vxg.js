import Vxg from '@voxgig/model-vue'
import '@voxgig/model-vue/dist/Vxg.css'

function makeVxg(Vue) {
  let vxg = new Vxg({})
  Vue.use(vxg)
}


export {
  makeVxg
}
