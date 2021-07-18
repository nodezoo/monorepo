const Axios = require('axios')
const JsonStream = require('JSONStream')


module.exports = function make_download_registry() {
  return async function download_registry(msg) {
    const seneca = this

    if (seneca.context.is_downloading) {
      return {
        ok: false,
        why: 'Download is already in progress...'
      }
    }

    const response = await Axios.get('https://replicate.npmjs.com/_all_docs?limit=5', {
      responseType: 'stream'
    })


    seneca.context.is_downloading = true

    response.data
      .pipe(JsonStream.parse(['rows', true]))
      .on('data', pkg_data => {
        if (!seneca.context.is_downloading) {
          /* NOTE: If a download has been aborted, this code will be called
           * multiple times per response. That's okay, the #destroy() method
           * becomes a no-op after the first call - it's not like double
           * "free"-ing of a pointer in C.
           */

          response.data.destroy()

          return
        }

        const { id: package_id, value } = pkg_data

        return seneca.make('nodezoo', 'npm')
          .data$({ name: package_id })
          .save$(err => {
            if (err) {
              seneca.log.error(err)
              return
            }

            return
          })
      })
      .once('close', () => {
        seneca.context.is_downloading = false
      })
      .once('error', err => {
        /* NOTE: Since the 'close' event is always triggered after the 'error'
         * event (or at least that's the way it's supposed to be) - we leave it
         * up to the handler of the 'close' event to set the `is_downloading` flag
         * to false.
         */

        seneca.log.error(err)
      })


    return {
      ok: true,
      data: { message: 'Downloading...' }
    }
  }
}
