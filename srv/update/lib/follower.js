const ChangesStream = require('changes-stream')

const NPM_URL = 'https://replicate.npmjs.com'


class Follower {
  constructor(seneca) {
    this.seneca = seneca
    this.feed = null
  }

  async start() {
    const seneca = this.seneca

    if (this.feed) {
      return false
    }

    this.feed = new ChangesStream({
      db: NPM_URL,
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
