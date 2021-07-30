import Axios from 'axios'


const api = Axios.create({
  baseURL: 'seneca/'
})


class Api {
  static async pkgsWithNameStartingWith(prefix) {
    return api.post('/pkgsWithNameStartingWith', {
      prefix
    })
  }


  static async bookmarkPkg(pkg_name) {
    return api.post('/bookmarkPkg', {
      name: pkg_name
    })
  }
}


export default Api
