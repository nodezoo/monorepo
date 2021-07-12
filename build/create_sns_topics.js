
  // TODO: filter only async


const Fs = require('fs')
const Seneca = require('seneca')

module.exports = async function(model, build) {

  const topics = []

  Object.entries(model.main.srv)
    .map(
      ([n,s])=>Object.keys(s.msg)
        .map(p=>Seneca.util.pincanon(p))
        .map(p=>'nodezoo_'+p.replace(/[,:]/g,'_'))
        .map(t=>'aws sns create-topic --name '+t)
        .map(t=>topics.push(t))
    )
  
  console.log('TOPICS', topics)

  Fs.writeFileSync('./deploy/aws/sns/create-topics.sh',topics.join('\n'))
}
