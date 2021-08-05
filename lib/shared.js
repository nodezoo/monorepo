

const shared = {
  isValidDate(maybe_date) {
    if (null == maybe_date) {
      return false
    }

    const time = maybe_date.getTime()

    return !Number.isNaN(time)
  },


  startOfDayUTC(date) {
    const date_wrapper = new Date(date)
    
    const year = date_wrapper.getUTCFullYear()
    const month = date_wrapper.getUTCMonth()
    const day = date_wrapper.getUTCDate()
    
    return new Date(Date.UTC(year, month, day))
  },


  nextDay(date) {
    const ms = date.getTime() + 24 * 60 * 60 * 1e3
    return new Date(ms)
  },


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
