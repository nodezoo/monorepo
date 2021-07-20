const Axios = require('axios')
const JsonStream = require('JSONStream')
const Qs = require('querystring')


class NpmDownload {
  constructor(seneca) {
    this.seneca = seneca
    this.response = null
    this.is_downloading = false
  }

  async start(q) {
    const self = this

    if (self.is_downloading) {
      return false
    }

    self.response = await Axios.get(make_npm_registry_url(q), {
      responseType: 'stream'
    })

    self.is_downloading = true

    self.response.data
      .pipe(JsonStream.parse(['rows', true]))
      .on('data', async (pkg_data) => {
        if (!self.is_downloading) {
          /* NOTE: If a download has been aborted, this code will be called
           * multiple times per response. That's okay, the #destroy() method
           * becomes a no-op after the first call - it's not like double
           * "free"-ing of a pointer in C.
           */

          self.response.data.destroy()

          return
        }

        const { id: pkg_name } = pkg_data

        await self.seneca.make('nodezoo', 'orig')
          .data$({ name: pkg_name })
          .save$()
          .catch(err => self.seneca.log.error(err.message))

        return
      })
      .once('close', () => {
        self.is_downloading = false
      })
      .once('error', err => {
        /* NOTE: Since the 'close' event is always triggered after the 'error'
         * event (or at least that's the way it's supposed to be) - we leave it
         * up to the handler of the 'close' event to reset the download's state.
         */

        self.seneca.log.error(err.message)

        return
      })

    return true
  }

  stop() {
    if (!this.is_downloading) {
      return false
    }

    this.is_downloading = false

    return true
  }
}


function make_npm_registry_url(q = {}) {
  return 'https://replicate.npmjs.com/_all_docs?' + Qs.stringify(q)
}


module.exports = NpmDownload
