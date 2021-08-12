const Axios = require('axios')
const OctokitLib = require('../../lib/github/octokit_lib')


module.exports = function make_get_rate_limit() {
  return async function get_rate_limit(msg) {
    const seneca = this

    seneca.root.context.octokit = OctokitLib.get_instance(seneca)

    const { octokit } = seneca.root.context
    const { data } = await octokit.rest.rateLimit.get()

    return { ok: true, data }
  }
}

