const Assert = require('assert')
const { Octokit } = require("@octokit/rest")
const { sleep } = require('../../lib/shared')


module.exports = function make_pull_package(options_wrapper) {
  /*
   * QUESTION: Why are the plugin options nested inside an object?
   * E.g. `{ options }` vs `options`
   */
  const { options } = options_wrapper
  const octokit = new Octokit()
  
  return async function pull_package(msg) {
    const seneca = this

    Assert(null != msg.name, 'msg.name')
    const { name } = msg


    let owner = msg.owner || null
    let repo = msg.repo || null

    // role:info,need:part only has name
    if(null == owner) {
      let giturl = await get_giturl(seneca, name, options)
      if('' == giturl) {
        return {ok:false,why:'no-giturl',name}
      }
    
      let m = /[\/:]([^\/:]+?)[\/:]([^\/]+?)(\.git)*$/.exec(giturl)
      if(!m) {
        return {ok:false,why:'bad-giturl',giturl:giturl,name}
      }

      owner = m[1]
      repo = m[2]
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


async function get_giturl(seneca, name, options) {
  let npment = await seneca.entity('nodezoo/npm').load$(name)

  // Might be new, wait for npm pull
  if(null == npment) {
    Assert(null != options.github_srv, 'options.github_srv')

    Assert(null != options.github_srv.wait_ms_on_npm,
      'options.github_srv.wait_ms_on_npm')

    const { github_srv: { wait_ms_on_npm } } = options

    await sleep(wait_ms_on_npm)


    npment = await seneca.entity('nodezoo/npm').load$(name)
  }

  return npment && npment.giturl || ''
}
