const Seneca = require('seneca')


module.exports = function make_process_change() {
  return async function process_change(msg) {
    const seneca = this

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


    /* NOTE: For more information please see:
     *
     * https://github.com/npm/registry/blob/master/docs/follower.md#clean-up
     *
     * - the part on "design docs".
     */
    const { id: pkg_name } = change

    seneca.act('role:info,need:part', { name: pkg_name })

    return { ok: true }
  }
}

