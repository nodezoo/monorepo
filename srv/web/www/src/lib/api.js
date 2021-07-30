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
}


export default Api
