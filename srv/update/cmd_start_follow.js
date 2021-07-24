const Follower = require('./lib/follower')


module.exports = function make_start_follow(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper


  return async function start_follow(msg) {
    const seneca = this

    seneca.root.context.feed =
      seneca.root.context.feed || new Follower(seneca, options)


    const started = await seneca.root.context
      .feed.start()


    const message = started
      ? 'Following the registry...'
      : 'The registry is already being followed.'

    return { ok: true, data: { message } }
  }
}

