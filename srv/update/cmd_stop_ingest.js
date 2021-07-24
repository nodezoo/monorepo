const Ingester = require('./lib/ingester')


module.exports = function make_stop_ingest(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function stop_ingest(msg) {
    const seneca = this

    seneca.root.context.pkg_ingestion =
      seneca.root.context.pkg_ingestion || new Ingester(seneca, options)

    const stopped = seneca.root.context.pkg_ingestion.stop()


    const message = stopped
      ? 'Stopping the ingestion loop...'
      : 'The ingestion loop was not running.'

    return { ok: true, data: { message } }
  }
}

