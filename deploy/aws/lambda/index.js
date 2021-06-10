const Seneca = require('seneca')
const Model = require('model.json')




let srvname = process.env.NODEZOO_SRV

let seneca = Seneca({legacy:false,log:'flat'})
seneca.context.model = Model

seneca
    .use('promisify')
    .use('reload', {active:false})
    .use('srv/'+srvname+'/'+srvname+'-srv')

exports.handler = async (event) => {
  let out = null
  try {
    out = await seneca.post(event)
  }
  catch(e) {
    out = {
      ok:false,
      code:e.code,
      message:e.message,
      details:e.details,
      stack:e.stack,
    }
  }
  
  const res = {
    statusCode: 200,
    body: JSON.stringify(out),
  }

  return res
}
