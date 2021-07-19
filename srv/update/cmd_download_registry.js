

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
const Lib = require('../../lib/update')


module.exports = function make_download_registry() {

  // Create download object etc.

  return async function download_registry(msg) {
    const seneca = this

    try {
      // TODO: make this idempotent
      // it's not an error to start downloading if already downloading
      if (seneca.root.context.is_downloading) {
        return {
          ok: false,
          why: 'The download is already in progress.'
        }
      }

      const q = { include_docs: true }

      // TODO: validation will be done by seneca-joi (or similar) and specific in model
      // thus no need to do this here.
      if (null != msg.limit && Number.isFinite(Number(msg.limit))) {
        q.limit = msg.limit
      } else if (!msg.all) {
        return {
          ok: false,

          // TODO: make this a code instead
          why: 'This is going to be a huge download - to confirm please' +
            ' include the `all: true` option. Alternatively, you may pass' +
            ' the numeric `limit` option.'
        }
      }

      // TODO: put all the Axios stuff into a separate utility
      // reference from seneca.root.context
      /*
      const download = seneca.root.context.download
      console.log('Download state', download.state) // 'running' | 'stopped'
      download.start()
      */
      
      
      const response = await Axios.get(make_registry_url(q), {
        responseType: 'stream'
      })


      // TODO: maybe use Axios events?
      seneca.root.context.is_downloading = true

      response.data
        .pipe(JsonStream.parse(['rows', true]))
        .on('data', pkg_data => {
          if (!seneca.root.context.is_downloading) {
            /* NOTE: If a download has been aborted, this code will be called
             * multiple times per response. That's okay, the #destroy() method
             * becomes a no-op after the first call - it's not like double
             * "free"-ing of a pointer in C.
             */

            response.data.destroy()

            return
          }

          // TODO: save to nodezoo/orig
          return seneca.make('nodezoo', 'npm')
            .data$(Lib.entdata_of_npm_data(pkg_data))
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
        why: 'Something went wrong. Please check the logs for more information.'
      }
    }
  }

  function make_registry_url(q = {}) {
    return 'https://replicate.npmjs.com/_all_docs?' + Qs.stringify(q)
  }
}
