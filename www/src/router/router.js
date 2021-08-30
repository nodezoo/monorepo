import VueRouter from 'vue-router'
import model from '../../model/model.json'

// TODO: This is hardcoded for now. See how this can be
// implemented via the Model.
//
import PackageDetailsView from '../components/PackageDetailsView.vue'

// TODO: This is hardcoded for now. See how this can be
// implemented via the Model.
//
import PremiumMembershipCheckoutView from '../components/PremiumMembershipCheckoutView.vue'


function makeRouter(Vue, {cmp}) {
  const routes = Object.entries(model.main.app.web.view).map(([n,v])=>({
    name: n,
    path: '/'+n,
    component: cmp[v.cmp],
    meta: {
      view: n
    }
  }))

  const dvn = model.main.app.web.defaults.view
  
  routes.push({
    path: '/',
    component: cmp[model.main.app.web.view[dvn].cmp],
    meta: {
      view: dvn
    }
  })

  // TODO: This is hardcoded for now. See how this can be
  // implemented via the Model.
  //
  routes.push({
    path: '/package/:packageName',
    component: PackageDetailsView
  })


  // TODO: This is hardcoded for now. See how this can be
  // implemented via the Model.
  //
  routes.push({
    path: '/checkout',
    component: PremiumMembershipCheckoutView
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
