/* NOTE: Put your setup code here.
 */


const Nock = require('nock')


beforeAll(() => {
  Nock.disableNetConnect()
  
  /* NOTE: We allow localhost connections so that we could test local routes.
   */
  Nock.enableNetConnect('127.0.0.1')
})

