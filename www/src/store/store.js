import Vuex from 'vuex'


function makeStore(Vue) {
  Vue.use(Vuex)
  
  return new Vuex.Store({
    state: {

      vxg: {
        ent: {
          meta: {
            name: 'Item'
          }
        },
        cmp: {
          BasicSide: {
            show: true
          },
          BasicHead: {
            allow: {
              add: true,
              search: true
            },
            show: {
              add: true,
              search: true
            },
          },
          BasicMain: {
            show: true
          }
        }
      },
      trigger: {
        led: {
          add: 0
        },
        search: {
          term: ''
        },
      },

    },
    
    mutations: {
    },
    actions: {
    },
    modules: {
    }
  })
}

export {
  makeStore
}
