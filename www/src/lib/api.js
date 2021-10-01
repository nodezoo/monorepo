
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:9099'


class Api {
  static async ping(args) {
    const res = await fetchOrCrash(
      apiUrl('/api/ping'),

      nodezooApiRequestOpts({
        method: 'POST'
      })
    )

    return res
  }

  static async requestPassReset(args) {
    const { email } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      request: 'pass_reset',
      email
    }

    const res = await fetchOrCrash(
      apiUrl('/api/public'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async resetPass(args) {
    const {
      reset_token,
      new_pass,
      new_pass_confirmation
    } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      reset: 'pass',
      reset_token,
      new_pass,
      new_pass_confirmation
    }

    const res = await fetchOrCrash(
      apiUrl('/api/public'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async submitPremiumMembershipCheckout(_args) {
    const res = await fetchOrCrash(
      apiUrl('/api/stripe/create-premium-membership-checkout-session'),

      nodezooApiRequestOpts({
        method: 'POST'
      })
    )

    return res
  }


  static async listPkgHistory(args) {
    const { name, since } = args

    const reqparams = {
      role: 'web',
      scope: 'account',
      list: 'pkg_history',
      name,
      since
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async registerUser(args) {
    const { email, pass, pass_confirm } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      register: 'user',
      email,
      pass,
      pass_confirm
    }

    const res = await fetchOrCrash(
      apiUrl('/api/public'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async loginUser(args) {
    const { email, pass } = args
    const reqparams = { email, pass }

    const res = await fetchOrCrash(
      apiUrl('/api/login'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async loginUserWithGitHub(args) {
    const { code } = args
    const reqparams = { code }

    const res = await fetchOrCrash(
      apiUrl('/api/login-with-gh'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async logoutUser(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      logout: 'user'
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async loadUserProfile(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      load: 'profile'
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async isPremiumUser(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      is: 'premium'
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      search: 'pkgs',
      prefix
    }

    const res = await fetchOrCrash(
      apiUrl('/api/public'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async listMyBookmarkedPkgs() {
    const reqparams = {
      role: 'web',
      scope: 'account',
      list: 'bookmarks'
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async showPkg(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      show: 'pkg',
      name
    }

    const res = await fetchOrCrash(
      apiUrl('/api/public'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async doBookmarkPkg(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'account',
      bookmark: 'pkg',
      name
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }


  static async removeBookmark(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'account',
      remove: 'bookmark',
      name
    }

    const res = await fetchOrCrash(
      apiUrl('/api/account'),

      nodezooApiRequestOpts({
        method: 'POST',
        body: JSON.stringify(reqparams)
      })
    )

    return res
  }
}


function apiUrl(path) {
  return API_URL + path
}


class RequestFailedError extends Error {
  constructor() {
    this.name = 'RequestFailedError'
  }
}


async function fetchOrCrash(...args) {
  const res = await fetch(...args)

  if (!res.ok) {
    throw new RequestFailedError()
  }

  return res
}


function nodezooApiRequestOpts(opts = {}) {
  const ans = {
    mode: 'cors',
    credentials: 'include',
    ...opts,
  }

  if (null != ans.body && !('headers' in ans)) {
    ans.headers = {
      'content-type': 'application/json'
    }
  }

  return ans
}


export default Api
