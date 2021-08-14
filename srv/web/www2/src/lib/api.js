import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:9000/' })


class Api {
  static async listPkgHistory(args) {
    const { name, since } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        list: 'pkg_history',
        name,
        since
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async loginUser(args) {
    const { email, pass } = args
    const reqparams = { email, pass }

    return api.post('/api/login', reqparams, {
      withCredentials: true
    })
  }


  static async logoutUser(_args) {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        logout: 'user'
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async loadUserProfile(_args) {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        load: 'profile'
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async makeUserPremium(_args) {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        join: 'premium'
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async isPremiumUser(_args) {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        is: 'premium'
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
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


  static async listMyBookmarkedPkgs() {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        list: 'bookmarks'
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
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

    return api.post('/api/public', reqparams, {
      withCredentials: true
    })
  }


  static async doBookmarkPkg(args) {
    const { name } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        bookmark: 'pkg',
        name
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }
}


export default Api
