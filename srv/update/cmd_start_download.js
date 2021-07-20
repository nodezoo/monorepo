

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

const { EventEmitter } = require('events')
const NpmDownload = require('./lib/download')


module.exports = function make_start_download() {
  return async function start_download(msg) {
    const seneca = this

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

    const listener = new EventEmitter()
      .on('data', async (pkg_data) => {
        const { id: pkg_name } = pkg_data

        await seneca.make('nodezoo', 'orig')
          .data$({ name: pkg_name })
          .save$()
          .catch(err => seneca.log.error(err.message))
      })
      .on('error', err => seneca.log.error(err.message))

    const started = await NpmDownload.start(q, listener)

    if (!started) {
      return {
        ok: true,
        data: { message: 'The download is already in progress.' }
      }
    }

    return {
      ok: true,
      data: { message: 'Downloading...' }
    }
  }
}
