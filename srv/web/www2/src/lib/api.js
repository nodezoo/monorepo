import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:9000/' })


class Api {
  static async requestPassReset(args) {
    const { email } = args

    const reqparams = {
      msg: {
        role: 'web',
        scope: 'public',
        request: 'pass_reset',
        email
      }
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
      msg: {
        role: 'web',
        scope: 'public',
        reset: 'pass',
        reset_token,
        new_pass,
        new_pass_confirmation
      }
    }

    return api.post('/api/public', reqparams)
  }


  static async submitPremiumMembershipCheckout(args) {
    const reqparams = {
      msg: {
        role: 'web',
        scope: 'account',
        checkout_for: 'premium',
        submit: 'checkout',
        payment_method: args.payment_method,
        card_number: args.card_number,
        sec_code: args.sec_code,
        exp_month: args.exp_month,
        exp_year: args.exp_year,
        first_name: args.first_name,
        last_name: args.last_name,
        city: args.city,
        billing_address: args.billing_address,
        zip: args.zip,
        country: args.country,
        phone_number: args.phone_number
      }
    }

    return api.post('/api/account', reqparams, {
      withCredentials: true
    })
  }


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
