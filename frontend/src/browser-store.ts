

function BrowserStore(this: any, options: any) {
  let seneca: any = this

  let pattern_fix = options.pattern_fix || {
    aim: 'web',
    on: 'entity'
  }

  let init = seneca.export('entity/init')

  let store = {
    name: 'browser-store',


    save: function(this: any, msg: any, reply: any) {
      let ent = msg.ent

      // TODO: this is not really namespace safe
      // .save$({...},{store$:false}) would be better
      let store = false !== ent.store$
      delete ent.store$

      let apimsg = {
        ent,
        canon: ent.entity$,
        store,
        save: 'entity',
        ...pattern_fix,
        debounce$: true,
      }

      this.act(apimsg, function save_result(err: Error, out: any) {
        if (err) reply(err)

        if (out.ok && out.ent) {
          reply(out.ent)
        }
        else {
          reply(out.err)
        }
      })
    },


    load: function(this: any, msg: any, reply: any) {
      let qent = msg.qent
      let q = msg.q || {}

      let store = false !== q.store$
      delete q.store$

      let apimsg = {
        q,
        canon: qent.entity$,
        store,
        load: 'entity',
        ...pattern_fix,
        debounce$: true,
      }

      this.act(apimsg, function load_result(err: Error, out: any) {
        if (err) reply(err)

        if (out.ok && out.ent) {
          reply(out.ent)
        }
        else {
          reply(out.err)
        }
      })
    },


    list: function(this: any, msg: any, reply: any) {
      let qent = msg.qent
      let q = msg.q || {}

      let store = false !== q.store$
      delete q.store$

      let apimsg = {
        q,
        canon: qent.entity$,
        store,
        list: 'entity',
        ...pattern_fix,
        debounce$: true,
      }

      this.act(apimsg, function list_result(this: any, err: Error, out: any) {
        if (err) reply(err)

        if (out.ok && out.list) {
          let list =
            out.list.map((item: any) => this.entity(qent.entity$).data$(item))
          reply(list)
        }
        else {
          reply(out.err)
        }
      })
    },


    remove: function(this: any, msg: any, reply: any) {
      let qent = msg.qent
      let q = msg.q || {}

      let store = false !== q.store$
      delete q.store$

      let apimsg = {
        q,
        canon: qent.entity$,
        store,
        remove: 'entity',
        ...pattern_fix,
        debounce$: true,
      }

      this.act(apimsg, function remove_result(err: Error, out: any) {
        if (err) reply(err)

        if (out.ok && out.ent) {
          reply(out.ent)
        }
        else {
          reply(out.err)
        }
      })
    },

    close: function(this: any, msg: any, reply: any) {
      reply()
    },

    native: function(this: any, msg: any, reply: any) {
      reply()
    },
  }

  let meta = init(seneca, options, store)

  return {
    name: store.name,
    tag: meta.tag,
  }

}


export default BrowserStore
