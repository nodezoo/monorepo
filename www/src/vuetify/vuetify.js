import Vuetify from 'vuetify/lib/framework'

function makeVuetify(Vue) {
  Vue.use(Vuetify)
  let vuetify = new Vuetify({
    theme: { disable: true }
  })
  vuetify.x=1
  console.log('makeVuetify',vuetify)
  return vuetify
}


export {
  makeVuetify
}
