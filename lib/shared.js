const Assert = require('assert')
const Moment = require('moment')
const Cron = require('node-cron')


const shared = {
  startOfDayUTC(date) {
    const date_wrapper = new Date(date)
    
    const year = date_wrapper.getUTCFullYear()
    const month = date_wrapper.getUTCMonth()
    const day = date_wrapper.getUTCDate()
    
    return new Date(Date.UTC(year, month, day))
  },


  tomorrow(now = new Date()) {
    const ms = now.getTime() + 24 * 60 * 60 * 1e3

    return shared.startOfDayUTC(new Date(ms))
  },


  today(now = new Date()) {
    return shared.startOfDayUTC(now)
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


  env_var_required(env_var) {
    const value = process.env[env_var]

    if (null == value) {
      throw new Error(`env var ${env_var} is missing`)
    }

    return value
  },


  schedule_once(action, opts) {
    const task = Cron.schedule('* * * * * *', () => {
      action()
      task.stop()
    }, opts)

    return task
  },


  schedule_every_thirty_seconds(action, opts) {
    return Cron.schedule('*/30 * * * * *', action, opts)
  },


  schedule_daily(args, action, opts) {
    const {
      hours: hrs,
      minutes: mins
    } = args

    Assert.strictEqual(typeof hrs, 'number', 'args.hours')
    Assert.strictEqual(typeof mins, 'number', 'args.minutes')


    const scheduled_daily = `${mins} ${hrs} * * *`

    return Cron.schedule(scheduled_daily, action, opts)
  },

  dedup(ary) {
    return [...new Set(ary)]
  }
}


module.exports = shared
