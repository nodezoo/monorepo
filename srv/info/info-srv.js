

module.exports = info



function info(options) {
  let seneca = this
  let reload = seneca.export('reload/make')(require)

  let model = seneca.context.model

  let srvmodel = model.main.srv.info

  for(let msg in srvmodel.msg) {
    seneca.message(msg, reload(actpath(msg)))
  }
}


function actpath(msg) {
  let path = './'+msg.split(/\s*,\s*/).slice(1).join('_').replace(/:/g,'_')
  console.log('AP', path)
  return path
}
