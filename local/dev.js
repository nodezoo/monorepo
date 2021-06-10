
const Seneca = require('seneca')
const Model = require('../model/model.json')


const seneca = Seneca({log:'flat'})
seneca.context.model = Model

seneca
  .use('promisify')
  .use('repl')
  .use('reload')

for([name, srv] of Object.entries(Model.main.srv)) {
  seneca.use('../srv/'+name+'/'+name+'-srv.js')
}


