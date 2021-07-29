class Api {
  static async list_pkgs() {
    await wait(1e3)

    const pkgs = [
      {
        name: 'express',
        version: '4.0.0',
        desc: 'Fast, unopinionated, minimalist web framework'
      },
      {
        name: 'seneca',
        version: '3.0.0',
        desc: 'Microservice framework for Node.js'
      },
      {
        name: 'seneca-mem-store',
        version: '6.0.3',
        desc: 'A Seneca.js data storage plugin.'
      }
    ]

    return make_response({ pkgs })
  }
}


const make_response = data => ({ data })
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))


export default Api
