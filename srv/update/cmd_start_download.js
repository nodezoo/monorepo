

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
//           one should be able to pause and resume - how do you track it (nodezoo/orig timestamp?)
//           we can assume there is only one list of all the packages (from step 1)

const { EventEmitter } = require('events')
const NpmDownload = require('./lib/download')


module.exports = function make_start_download(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function start_download(msg) {
    const seneca = this

    seneca.root.context.npm_download =
      seneca.root.context.npm_download || new NpmDownload(seneca, options)


    const q = { include_docs: false }

    if (null != msg.limit) {
      q.limit = msg.limit
    } else if (!msg.all) {
      return {
        ok: false,
        why: 'confirm_start_download'
      }
    }


    const started = await seneca.root.context
      .npm_download.start(q)


    const message = started
      ? 'Downloading...'
      : 'The download is already in progress.'

    return { ok: true, data: { message } }
  }
}
