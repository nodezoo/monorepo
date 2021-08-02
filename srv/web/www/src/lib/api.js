import Axios from 'axios'


// TODO: Do not hardcode this.
//
const api = Axios.create({ baseURL: 'http://localhost:8080/seneca/' })


class Api {
  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args
    return api.post('/listPkgsWithNamePrefix', { prefix })
  }


  static async listMyBookmarkedPkgs() {
    return api.post('/listMyBookmarkedPkgs')
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
