
module.exports = function make_stop_follow(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function stop_follow(msg) {
    const seneca = this

    seneca.root.context.feed =
      seneca.root.context.feed || new Follower(seneca, options)

    const stopped = seneca.root.context.feed.stop()

    const message = stopped
      ? 'The feed has been stopped'
      : 'The feed was not running'

    return { ok: true, data: { message } }
  }
}


