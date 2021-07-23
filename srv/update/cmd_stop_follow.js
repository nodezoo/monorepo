
module.exports = function make_stop_follow() {
  return async function stop_follow(msg) {
    const seneca = this

    seneca.root.context.feed =
      seneca.root.context.feed || new Follower(seneca)

    const stopped = seneca.root.context.feed.stop()

    const message = stopped
      ? 'The feed has been stopped'
      : 'The feed was not running'

    return { ok: true, data: { message } }
  }
}


