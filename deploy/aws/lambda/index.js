
const AWS = require('aws-sdk')
const Seneca = require('seneca')
const Model = require('model.json')


const SNS = new AWS.SNS({apiVersion: '2010-03-31'})


let srvname = process.env.NODEZOO_SRV
let topic_prefix = process.env.NODEZOO_TOPIC_PREFIX

console.log('INIT', srvname)


let seneca = Seneca({legacy:false,log:'flat'})
seneca.context.model = Model

seneca
  .test()
  .use('promisify')
  .use('sns-transport', {
    topic: {
      prefix: topic_prefix
    },
    SNS: () => SNS
  })
  .use('reload', {active:false})
  .use('srv/'+srvname+'/'+srvname+'-srv')
  .listen({type:'sns'})
  .ready(()=>{
    exports.handler = seneca.export('sns-transport/handler')
  })

/*
exports.handler = function(event, context, callback) {
  seneca.ready(function() {
    let handler = seneca.export('sns-transport/handler')
    handler(event, context, callback)
  })
}
*/
