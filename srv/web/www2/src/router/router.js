import VueRouter from 'vue-router'

import model from '../../model/model.json'

function makeRouter(Vue, {cmp}) {

  const routes = Object.entries(model.main.app.web.view).map(([n,v])=>({
    name: n,
    path: '/'+n,
    component: cmp[v.cmp],
    meta: {
      view: n
    }
  }))

  let dvn = model.main.app.web.defaults.view
  
  routes.push({
    path: '/',
    component: cmp[model.main.app.web.view[dvn].cmp],
    meta: {
      view: dvn
    }
  })

  console.log('ROUTES', routes)

  
  Vue.use(VueRouter)

  const router = new VueRouter({
    mode: 'history',
    routes,
  })

  return router
}

export {
  makeRouter
}
