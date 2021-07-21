const Seneca = require('seneca')
const Model = require('../model/model.json')


const seneca = Seneca({ log: 'flat' })
seneca.context.model = Model

seneca
  .test('print')
  .error(console.log)
  .use('promisify')
  .use('entity')
  .use('mem-store')
  .use('repl')
  .use('reload')


for(const [name, srv] of Object.entries(Model.main.srv)) {
  seneca.use('../srv/'+name+'/'+name+'-srv.js')
}
