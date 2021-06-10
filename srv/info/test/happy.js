
const Seneca = require('seneca')
const Model = require('../../../model/model.json')


const seneca = Seneca({log:'flat'})
seneca.context.model = Model

seneca
  .use('promisify')
  .use('../info-srv')
  .act('role:info,get:info', seneca.util.print)
