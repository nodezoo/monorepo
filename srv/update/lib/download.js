const Assert = require('assert')
const Axios = require('axios')
const JsonStream = require('JSONStream')
const Qs = require('querystring')
const Shared = require('../../../lib/shared')


class NpmDownload {
  constructor(seneca, options) {
    this.seneca = seneca
    this.options = options
    this.response = null
    this.is_downloading = false
  }

  async start(q) {
    const self = this

    if (self.is_downloading) {
      return false
    }

    const url = make_npm_registry_url(q, self.options)
    self.response = await Axios.get(url, { responseType: 'stream' })

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

        await self.seneca.post('role:update,scope:pkg,prepare:ingest', {
          pkg_name
        })


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

        console.error(err.message)

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


function make_npm_registry_url(q, options) {
  Assert(null != options.npm_registry_url, 'options.npm_registry_url')

  const { npm_registry_url } = options

  return npm_registry_url + '/_all_docs?' + Qs.stringify(q)
}


module.exports = NpmDownload
