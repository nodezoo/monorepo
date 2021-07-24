const ChangesStream = require('changes-stream')
const Shared = require('../../../lib/shared')


class Follower {
  constructor(seneca, options) {
    this.seneca = seneca
    this.options = options
    this.feed = null
  }

  async start() {
    const seneca = this.seneca
    const { npm_registry_url } = this.options

    if (this.feed) {
      return false
    }

    this.feed = new ChangesStream({
      db: npm_registry_url,
      since: 'now',

      /* NOTE: need:part will take care of fetching the data. In the future,
       * however, we may want to fetch the data here right off the bat.
       */
      include_docs: false
    })

    this.feed.on('data', change => {
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

    return true
  }


  stop() {
    if (!this.feed) {
      return false
    }

    this.feed.cleanup()
    this.feed.destroy()

    this.feed = null

    return true
  }
}


module.exports = Follower
