import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:9000/' })


class Api {
  static async listPkgHistory(args) {
    const { auth_token, name, since } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        list: 'pkg_history',
        name,
        since
      }
    }

    return api.post('/api/account', reqparams, { headers })
  }


  static async loginUser(args) {
    const { email, pass } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'public',
        login: 'user',
        email,
        pass
      }
    }

    return api.post('/api/public', reqparams)
  }


  static async logoutUser(args) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        logout: 'user'
      }
    }

    return api.post('/api/account', reqparams, { headers })
  }


  static async isPkgBookmarkedByMe(args) {
    const { auth_token, name } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }

    return api.post('/seneca/isPkgBookmarkedByMe', { name }, { headers })
  }


  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'public',
        search: 'pkgs',
        prefix
      }
    }

    return api.post('/api/public', reqparams)
  }


  static async listMyBookmarkedPkgs(args = {}) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }


    return api.post('/seneca/listMyBookmarkedPkgs',
      {},
      { headers })
  }


  static async doBookmarkPkg(args) {
    const { auth_token } = args
    const headers = {}

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }


    const { name } = args

    return api.post('/seneca/doBookmarkPkg', { name }, { headers })
  }


  static async showPkg(args) {
    const { name } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'public',
        show: 'pkg',
        name
      }
    }

    return api.post('/api/public', reqparams)
  }
}


export default Api
