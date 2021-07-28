const { Octokit } = require("@octokit/rest")

class OctokitLib {
  static get_instance(seneca, _options = {}) {
    return seneca.root.context.octokit || new Octokit()
  }
}

module.exports = OctokitLib
