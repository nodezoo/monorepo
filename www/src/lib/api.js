import Axios from 'axios'


const base_url = process.env.VUE_APP_API_URL || 'http://localhost:9099'
const api = Axios.create({ baseURL: base_url })


class Api {
  static async requestPassReset(args) {
    const { email } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      request: 'pass_reset',
      email
    }

    return api.post('/api/public', reqparams)
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

    return api.post('/api/public', reqparams)
  }


  static async submitPremiumMembershipCheckout(_args) {
    const reqparams = {}

    return api.post('/api/stripe/create-premium-membership-checkout-session', reqparams, {
      withCredentials: true
    })
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

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
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

    return api.post('/api/public', reqparams)
  }


  static async loginUser(args) {
    const { email, pass } = args
    const reqparams = { email, pass }

    return api.post('/api/login', reqparams, {
      withCredentials: true
    })
  }


  static async loginUserWithGitHub(args) {
    const { code } = args
    const reqparams = { code }

    return api.post('/api/login-with-gh', reqparams, {
      withCredentials: true
    })
  }


  static async logoutUser(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      logout: 'user'
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async loadUserProfile(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      load: 'profile'
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async isPremiumUser(_args) {
    const reqparams = {
      role: 'web',
      scope: 'account',
      is: 'premium'
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      search: 'pkgs',
      prefix
    }

    return api.post('/api/public', reqparams)
  }


  static async listMyBookmarkedPkgs() {
    const reqparams = {
      role: 'web',
      scope: 'account',
      list: 'bookmarks'
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async showPkg(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'public',
      show: 'pkg',
      name
    }

    return api.post('/api/public', reqparams, {
      withCredentials: true
    })
  }


  static async doBookmarkPkg(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'account',
      bookmark: 'pkg',
      name
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


  static async removeBookmark(args) {
    const { name } = args

    const reqparams = {
      role: 'web',
      scope: 'account',
      remove: 'bookmark',
      name
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }
}


export default Api
