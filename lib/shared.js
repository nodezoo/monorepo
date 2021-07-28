

const shared = {

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },


  pick(obj, props) {
    return Object.keys(obj)
      .filter(p => props.includes(p))
      .reduce((h, k) => {
        h[k] = obj[k]
        return h
      }, {})
  },


  messages(seneca, options, reload, require) {
    let srvname = seneca.fixedargs.plugin$.name
    let model = seneca.context.model
    let srvmodel = model.main.srv[srvname]

    for(let msg in srvmodel.msg) {
      let msgspec = srvmodel.msg[msg]
      if(msgspec.async) {
        seneca.add(msg, (msg,reply)=>reply())

        /* QUESTION: Why are the plugin options nested inside an object?
         * E.g. `{ options }` vs `options`
         */
        seneca.sub(msg, reload(shared.actpath(msg), {options}))
      }
      else {
        /* QUESTION: Why are the plugin options nested inside an object?
         * E.g. `{ options }` vs `options`
         */
        seneca.message(msg, reload(shared.actpath(msg), {options}))
      }
    }
  },


  actpath(msg) {
    let pairs = msg.split(/\s*,\s*/)

    // TODO: maybe take more than just the last one!
    let path = './'+pairs[pairs.length-1].replace(/:/g,'_')
    return path
  },
}


module.exports = shared
