import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:8080/seneca/' })


class Api {
  static async loginUser(args) {
    const { email, pass } = args
    return api.post('/loginUser', { email, pass })
  }


  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args
    return api.post('/listPkgsWithNamePrefix', { prefix })
  }


  static async listMyBookmarkedPkgs(args = {}) {
    const headers = {}


    const { auth_token } = args

    if ('string' === typeof auth_token) {
      headers['authorization'] = `Bearer ${auth_token.trim()}`
    }


    return api.post('/listMyBookmarkedPkgs',
      {},
      { headers })
  }


  static async doBookmarkPkg(args) {
    const { name } = args
    return api.post('/doBookmarkPkg', { name })
  }


  static async showPkg(args) {
    const { name } = args
    return api.post('/showPkg', { name })
  }
}


export default Api
