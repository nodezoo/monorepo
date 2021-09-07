const Seneca = require('seneca')


module.exports = function make_prepare_ingest() {
  return async function prepare_ingest(msg) {
    const seneca = this


    const { pkg_name = null } = msg

    if (null == pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pkg_name'],
          why_exactly: 'required'
        }
      }
    }

    /* NOTE: Setting ingested_at to null, coupled with the upsert on the
     * `name` field, will cause the package to be re-ingested when the
     * ingestion action is requested after the download process is done.
     *
     * By the "download process" we are referring to pulling package
     * names off the npm registry for further "ingestion". The "ingestion"
     * of a package means pulling the actual package data.
     */
    await seneca.make('nodezoo', 'orig')
      .data$({ name: pkg_name, ingested_at: null })
      .save$({ upsert$: ['name'] })


    return { ok: true }
  }
}

