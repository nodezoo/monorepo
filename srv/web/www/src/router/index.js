import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ShowPkg from '../views/ShowPkg.vue'
import MyFavorites from '../views/MyFavorites.vue'
import NotFound from '../views/NotFound.vue'


Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/pkgs/:name',
    name: 'ShowPkg',
    component: ShowPkg,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/me/favorites',
    name: 'MyFavorites',
    component: MyFavorites,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: NotFound,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    // NOTE: This is a catch-all route. If none of the routes above
    // have matched, this is the route that WILL match. We use it
    // to show the Not Found page.
    //
    path: '*',
    component: NotFound,
    meta: {
      requiresAuth: false
    }
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const isAuthRequired = to.matched.some(record => record.meta?.requiresAuth)
  const session = router.app.$session

  if (isAuthRequired &&
    (!session?.exists() || !session?.has('AUTH_TOKEN'))) {
    //
    // TODO: Call backend to check the token's validity.
    //

    return next({
      path: '/login',
      params: { nextUrl: to.fullPath }
    })
  }

  return next()
})


export default router
