

const shared = {

  messages(seneca, options, reload, require) {
    let srvname = seneca.fixedargs.plugin$.name
    let model = seneca.context.model
    let srvmodel = model.main.srv[srvname]

    for(let msg in srvmodel.msg) {
      let msgspec = srvmodel.msg[msg]
      if(msgspec.async) {
        seneca.add(msg, (msg,reply)=>reply())
        seneca.sub(msg, reload(shared.actpath(msg, msgspec), {options}))
      }
      else {
        seneca.message(msg, reload(shared.actpath(msg, msgspec), {options}))
      }
    }
  },

  actpath(msg, spec = {}) {
    const localpath = path => './' + path

    if (spec.filename) {
      return localpath(spec.filename)
    }

    const pairs = msg.split(/\s*,\s*/)

    // TODO: maybe take more than just the last one!
    //
    const path = localpath(pairs[pairs.length - 1].replace(/:/g,'_'))

    return path
  },
}


module.exports = shared
