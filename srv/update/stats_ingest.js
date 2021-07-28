const Ingester = require('./lib/ingester')


module.exports = function make_stats_ingest(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function stat_ingest(msg) {
    const seneca = this

    seneca.root.context.pkg_ingestion =
      seneca.root.context.pkg_ingestion || new Ingester(seneca, options)

    const stats = seneca.root.context.pkg_ingestion.stats()


    return { ok: true, data: { stats } }
  }
}


