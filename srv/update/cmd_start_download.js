

// PROCESSING APPROACH
//
// step 1: download all the data, or continue downloading... as below
//           "download"
//           can we pause and restart the download? from certain points?
//           maybe we should just download the ids?
// step 2: separate "process" (ie. action), collect all the meta data, from github
//           "ingest"
//           for everything nodezoo/orig
//           use need:part to get actual data
//           pause and restartable - how do you track it (nodezoo/orig timestamp?)
//           we can assume there is only one list of all the packages (from step 1)

const Axios = require('axios')
const JsonStream = require('JSONStream')
const Qs = require('querystring')


module.exports = function make_start_download() {

  // Create download object etc.

  return async function start_download(msg) {
    const seneca = this

    try {
      if (seneca.root.context.is_downloading) {
        return {
          ok: true,
          data: {
            message: 'The download is already in progress.'
          }
        }
      }

      const q = { include_docs: false }

      if (null != msg.limit) {
        q.limit = msg.limit
      } else if (!msg.all) {
        return {
          ok: false,
          why: 'confirm_start_download'
        }
      }

      // TODO: put all the Axios stuff into a separate utility
      // reference from seneca.root.context
      /*
      const download = seneca.root.context.download
      console.log('Download state', download.state) // 'running' | 'stopped'
      download.start()
      */


      const response = await Axios.get(make_npm_registry_url(q), {
        responseType: 'stream'
      })


      /* QUESTION: Maybe use Axios events?
       */
      seneca.root.context.is_downloading = true

      response.data
        .pipe(JsonStream.parse(['rows', true]))
        .on('data', pkg_data => {
          if (!seneca.root.context.is_downloading) {
            /* NOTE: If a download has been aborted, this code will be called
             * multiple times per response. That's okay, the #destroy() method
             * becomes a no-op after the first call - it won't crash like it
             * would, for example, if you were double "free"-ing of a pointer
             * in C.
             */

            response.data.destroy()

            return
          }

          const { id: pkg_name } = pkg_data

          return seneca.make('nodezoo', 'orig')
            .data$({ name: pkg_name })
            .save$(err => {
              if (err) {
                seneca.log.error(err.message)
                return
              }

              return
            })
        })
        .once('close', () => {
          seneca.root.context.is_downloading = false
        })
        .once('error', err => {
          /* NOTE: Since the 'close' event is always triggered after the 'error'
           * event (or at least that's the way it's supposed to be) - we leave it
           * up to the handler of the 'close' event to set the `is_downloading` flag
           * to false.
           */

          seneca.log.error(err.message)
        })


      return {
        ok: true,
        data: { message: 'Downloading...' }
      }
    } catch (err) {
      seneca.log.error(err.message)

      seneca.root.context.is_downloading = false

      return {
        ok: false,
        why: 'server_error'
      }
    }
  }

  function make_npm_registry_url(q = {}) {
    return 'https://replicate.npmjs.com/_all_docs?' + Qs.stringify(q)
  }
}
