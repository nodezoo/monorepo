const Ingester = require('./lib/ingester')


module.exports = function make_start_ingest(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function start_ingest(msg) {
    const seneca = this

    seneca.root.context.pkg_ingestion =
      seneca.root.context.pkg_ingestion || new Ingester(seneca, options)


    const started = await seneca.root.context
      .pkg_ingestion.start(msg)


    const message = started
      ? 'The ingestion loop has been started ok.'
      : 'The ingestion loop is already running.'

    return { ok: true, data: { message } }
  }
}

