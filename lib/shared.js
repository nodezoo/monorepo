

const shared = {

  messages(seneca, reload) {
    console.log(seneca)
    let srvname = seneca.fixedargs.plugin$.name
    let model = seneca.context.model
    let srvmodel = model.main.srv[srvname]

    for(let msg in srvmodel.msg) {
      seneca.message(msg, reload(shared.actpath(msg)))
    }
  },

  
  actpath(msg) {
    let pairs = msg.split(/\s*,\s*/)
    let path = './'+pairs[pairs.length-1].replace(/:/g,'_')
    return path
  },

}


module.exports = shared
