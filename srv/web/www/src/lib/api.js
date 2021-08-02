import Axios from 'axios'


const api = Axios.create({ baseURL: 'seneca/' })


class Api {
  static async listPkgsWithNamePrefix(args) {
    const { prefix } = args
    return api.post('/listPkgsWithNamePrefix', { prefix })
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
