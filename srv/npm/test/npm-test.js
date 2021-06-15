
const Model = require('../../../model/model.json')
const SenecaMsgTest = require('seneca-msg-test')

SenecaMsgTest({
  init: (seneca) => {
    seneca.context.model = Model
    return seneca
      .use('promisify')
      .use('entity')
      .use('reload', {active:false})
      .use('../npm-srv')
  },
  print: true,
  test: true,
  fix: 'role:source,source:npm',
  allow: { missing: true },
  data: {
    nodezoo: {
      npm: {
        lodash: {
          id: 'lodash',
          name: 'lodash'
        },
      },
    },
  },

  calls: LN => [
    LN({
      pattern: 'get:package',
      params: {
        name:'lodash',
      },
      out: {
        ok: true,
        pkg: {
          id: 'lodash',
          name: 'lodash'
        }
      },
    }),
  ]
})()
