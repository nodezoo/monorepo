const Axios = require('axios')
const { Octokit } = require("@octokit/rest")


module.exports = function make_get_rate_limit() {
  const octokit = new Octokit()

  return async function get_rate_limit(msg) {
    const seneca = this

    const { data } = await octokit.rest.rateLimit.get()

    return { ok: true, data }
  }
}

