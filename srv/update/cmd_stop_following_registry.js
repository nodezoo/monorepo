
module.exports = function make_stop_following_registry() {
  return async function stop_following_registry(msg) {
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


