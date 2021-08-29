const Fs = require('fs')
const Path = require('path')
const { Octokit } = require('@octokit/rest')
const { createAppAuth, createOAuthUserAuth } = require('@octokit/auth-app')


class OctokitLib {
  static async get_instance(seneca, options = {}) {
    if (null == seneca.root.context.octokit) {
      const octokit_opts = {}


      const { github_api_url = null } = options

      if (null == github_api_url) {
        throw new Error('github_api_url cannot be null')
      }

      octokit_opts.baseUrl = github_api_url


      const { github_app = null } = options

      if (null != github_app) {
        const { client_id = null } = github_app

        if (null == client_id) {
          throw new Error(
            'github_app is given, hence github_app.client_id cannot be null'
          )
        }

        const { client_secret = null } = github_app

        if (null == client_secret) {
          throw new Error(
            'github_app is given, hence github_app.client_secret cannot be null'
          )
        }

        const { app_id = null } = github_app

        if (null == app_id) {
          throw new Error(
            'github_app is given, hence github_app.app_id cannot be null'
          )
        }

        const { installation_id = null } = github_app

        if (null == installation_id) {
          throw new Error(
            'github_app is given, hence github_app.installation_id cannot be null'
          )
        }

        const { private_key_path = null } = github_app

        if (null == private_key_path) {
          throw new Error(
            'github_app is given, hence github_app.private_key_path cannot be null'
          )
        }


        const private_key = await Fs.promises
          .readFile(Path.join(process.cwd(), private_key_path), 'utf-8')


        octokit_opts.authStrategy = createAppAuth

        octokit_opts.auth = {
          appId: app_id,
          privateKey: private_key,
          clientId: client_id,
          clientSecret: client_secret,
          installationId: installation_id
        }
      }


      seneca.root.context.octokit = new Octokit(octokit_opts)
    }

    return seneca.root.context.octokit
  }
}


module.exports = OctokitLib
