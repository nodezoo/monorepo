const ChangesStream = require('changes-stream')
const Seneca = require('seneca')

const NPM_URL = 'https://replicate.npmjs.com'


module.exports = function make_follow_registry() {
  return async function follow_registry(msg) {
    const seneca = this

    if (seneca.root.context.feed) {
      return { ok: false, why: 'The registry is already being followed.' }
    }

    // TODO: same idea as download - separate util in lib
    seneca.root.context.feed = new ChangesStream({
      db: NPM_URL,
      since: 'now',
      include_docs: true
    })

    seneca.root.context.feed.on('data', change => {
      return seneca.act(
        'role:update,cmd:process_change',

        { change },

        function (err) {
          if (err) {
            seneca.log.error(err.message)
            return
          }

          return
        }
      )
    })

    return {
      ok: true,
      data: { message: 'Following the registry...' }
    }
  }
}

