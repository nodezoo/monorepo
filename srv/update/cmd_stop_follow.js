
module.exports = function make_stop_follow() {
  return async function stop_follow(msg) {
    const seneca = this

    const { feed } = seneca.root.context

    if (feed) {
      feed.cleanup()
      feed.destroy()

      seneca.root.context.feed = null

      return {
        ok: true,
        data: {
          message: 'Stopping...'
        }
      }
    }

    return {
      ok: true,
      data: {
        message: 'I will succeed, although the registry was not being followed.'
      }
    }
  }
}


