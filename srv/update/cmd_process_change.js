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


    const is_pkg_change = null != change.doc.name

    if (is_pkg_change) {
      /* TODO: Save changes.
       */

      return { ok: true }
    }


    seneca.log.info("This doesn't seem like the kind of change that we" +
      ' currently recognize. I will output the object below for you to' +
      ' inspect:\n')

    seneca.log.info(JSON.stringify(change))


    return { ok: false, why: 'Unrecognized format of the change.' }
  }
}

