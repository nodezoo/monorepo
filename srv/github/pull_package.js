const Assert = require('assert')
const OctokitLib = require('../../lib/github/octokit_lib')
const { owner_and_repo_from_giturl } = require('../../lib/github/shared')
const { sleep } = require('../../lib/shared')


module.exports = function make_pull_package(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper

  return async function pull_package(msg) {
    const seneca = this

    seneca.root.context.octokit = OctokitLib.get_instance(seneca, options)
    const { octokit } = seneca.root.context


    Assert(null != msg.name, 'msg.name')
    const { name } = msg


    await wait_on_npm_pull(options)

    const npment = await seneca.entity('nodezoo', 'npm')
      .load$({ name })

    if (null == npment) {
      return { ok: false, why: 'not-found', name }
    }


    let owner = msg.owner || null
    let repo = msg.repo || null

    // role:info,need:part only has name
    if(null == owner || null == repo) {
      const { giturl } = npment

      if (null == giturl) {
        return { ok:false,why:'no-giturl',name }
      }

      const parsed = owner_and_repo_from_giturl(giturl)

      if (null == parsed) {
        return { ok:false,why:'bad-giturl',giturl:giturl,name }
      }


      owner = owner || parsed.owner
      repo = repo || parsed.repo
    }


    const pkg = await octokit.repos.get({ owner, repo })

    out = { ok:true }
    
    let github = seneca.entity('nodezoo/github')
    github = await github.load$(name) || github.data$({id$:name})
      
    const ent = await github.data$({
      name:    msg.name,
      owner:   owner,
      repo:    repo,
      stars:   pkg.data.stargazers_count,
      watches: pkg.data.subscribers_count,
      forks:   pkg.data.forks_count,
      last:    pkg.data.pushed_at
    }).save$()

    out.pkg = ent

    return out
  }
}


async function wait_on_npm_pull(options) {
  Assert(null != options.github_srv, 'options.github_srv')

  Assert(null != options.github_srv.wait_ms_on_npm,
    'options.github_srv.wait_ms_on_npm')

  const { github_srv: { wait_ms_on_npm } } = options

  await sleep(wait_ms_on_npm)
}

