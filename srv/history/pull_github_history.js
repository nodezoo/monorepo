const Assert = require('assert')
const Moment = require('moment')
const OctokitLib = require('../../lib/github/octokit_lib')
const { owner_and_repo_from_giturl } = require('../../lib/github/shared')
const { startOfDayUTC } = require('../../lib/shared')
const { make_timestamp } = require('./lib/shared')


module.exports = function make_pull_github_history(options_wrapper) {
  const { options } = options_wrapper

  return async function pull_github_history(msg) {
    const seneca = this

    seneca.root.context.octokit = await OctokitLib.get_instance(seneca, options)
    const { octokit } = seneca.root.context


    if ('string' !== typeof msg.pkg_name) {
      return {
        ok: false,
        why: 'invalid-field',
        details: {
          path: ['pkg_name'],
          why_exactly: 'required'
        }
      }
    }

    const { pkg_name } = msg


    const npment = await seneca.entity('nodezoo', 'npm')
      .load$({ name: pkg_name })

    if (null == npment) {
      return { ok: false, why: 'not-found', name: pkg_name }
    }



    const { giturl } = npment

    if (null == giturl) {
      return { ok: false, why: 'no-giturl', name: pkg_name }
    }


    const parsed_giturl = owner_and_repo_from_giturl(giturl)

    if (null == parsed_giturl) {
      return { ok: false, why: 'bad-giturl', giturl, name: pkg_name }
    }


    const today = startOfDayUTC(new Date())


    const { owner, repo } = parsed_giturl
    const pkg = await octokit.repos.get({ owner, repo })


    await seneca.make('nodezoo', 'history')
      .data$({
        name: pkg_name,
        gh_stars: pkg.data.stargazers_count,
        gh_forks: pkg.data.forks_count,
        gh_issues: pkg.data.open_issues_count, 
        day: make_timestamp(today)
      })
      .save$({ upsert$: ['name', 'day'] })


    return { ok: true }
  }
}

