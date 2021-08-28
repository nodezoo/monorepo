const { Octokit } = require('@octokit/rest')

class OctokitLib {
  static get_instance(seneca, options = {}) {
    const { github_api_url = null } = options

    if (null == github_api_url) {
      throw new Error('github_api_url cannot be null')
    }

    return seneca.root.context.octokit || new Octokit({
      baseUrl: github_api_url
    })
  }
}

module.exports = OctokitLib
