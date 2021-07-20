const Seneca = require('seneca')


module.exports = function make_process_change() {
  return async function process_change(msg) {
    const seneca = this

    try {
      const { change } = msg

      if (null == change) {
        /* NOTE: A null-change is just no change. How do we process no change?
         * That's right - we relax and do nothing at all!
         */

        return { ok: true }
      }


      if (change.deleted) {
        /* NOTE: A package has been marked as deleted.
         * TODO: Set the package as such in the store.
         */

        return { ok: true }
      }


      /* NOTE: For more information on why we do this kind of checking,
       * please see:
       *
       * https://github.com/npm/registry/blob/master/docs/follower.md#clean-up
       *
       * - the part on "design docs".
       */
      const is_pkg_change = null != change.doc.name

      if (is_pkg_change) {
        const { id: pkg_name } = pkg_data

        await seneca.post('role:info,need:part', { name: pkg_name })

        return { ok: true }
      }


      seneca.log.info("This doesn't look like the kind of change that we" +
        ' currently recognize. I will output the object below for you to' +
        ' inspect:\n')

      seneca.log.info(JSON.stringify(change))


      return resolve({ ok: false, why: 'unknown_feed_format' })
    } catch (err) {
      seneca.log.error(err.message)

      return resolve({ ok: false, why: 'server_error' })
    }
  }
}

