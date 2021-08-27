const { Octokit } = require('@octokit/rest')

class OctokitLib {
  static get_instance(seneca, options = {}) {
    const { github_registry_url = null } = options

    if (null == github_registry_url) {
      throw new Error('github_registry_url cannot be null')
    }

    return seneca.root.context.octokit || new Octokit({
      baseUrl: github_registry_url
    })
  }
}

module.exports = OctokitLib
