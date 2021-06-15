
const AWS = require('aws-sdk')
const Seneca = require('seneca')
const Model = require('model.json')


const SNS = new AWS.SNS({apiVersion: '2010-03-31'})


let srvname = process.env.NODEZOO_SRV
let topic_prefix = process.env.NODEZOO_TOPIC_PREFIX

// [/main/srv/*/msg[async==true]#key]
let outbound = Object.values(Model.main.srv).reduce((a,srv)=>(Object.entries(srv.msg).map(m=>a.push(m)),a),[]).filter(m=>m[1].async).map(m=>m[0])

console.log('INIT', srvname, outbound)


let seneca = Seneca({legacy:false,log:'flat'})
seneca.context.model = Model

seneca
  .test()
  .error(console.log)
  .use('promisify')
  .use('entity')
  .use('dynamo-store', {
    aws: { default: true },
    dc: { default: true },
  })
  .use('sns-transport', {
    topic: {
      prefix: topic_prefix
    },
    SNS: () => SNS
  })
  .use('reload', {active:false})
  .listen({type:'sns'})
  .client({type:'sns', pin:outbound})
  .use('srv/'+srvname+'/'+srvname+'-srv')

// exports.handler = seneca.export('sns-transport/handler')


exports.handler = function(event, context, callback) {
  seneca.ready(function() {
    console.log('EVENT', event)
    let handler = seneca.export('sns-transport/handler')
    return handler(event, context, callback)
  })
}

