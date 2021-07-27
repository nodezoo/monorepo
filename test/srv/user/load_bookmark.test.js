const Assert = require('assert')
const Seneca = require('seneca')
const TestHelpers = require('../../support/helpers')
const { register_user, login_user, make_seneca } = TestHelpers
const make_load_bookmark = require('../../../srv/user/load_bookmark')


describe('load bookmark', () => {
  describe('when the auth token is missing from the msg', () => {
    const seneca = make_seneca()
    const load_bookmark = make_load_bookmark()


    it('shall not pass', async () => {
      const res = await load_bookmark.call(seneca, {})
      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the auth token is invalid', () => {
    const seneca = make_seneca()
    const load_bookmark = make_load_bookmark()


    it('shall not pass', async () => {
      await setup_logged_in_user({
        email: 'alice@example.com',
        pass: '012345678'
      }, { seneca })


      const msg = { auth_token: 'aleaiactaest' }
      const res = await load_bookmark.call(seneca, msg)


      expect(res).toEqual({ ok: false, why: 'unauthorized' })
    })
  })


  describe('when the bookmark id is missing', () => {
    const seneca = make_seneca()
    const load_bookmark = make_load_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('responds with a validation error', async () => {
      const { auth_token } = await setup_logged_in_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const msg = { auth_token }
      const res = await load_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: false,
        why: 'invalid-field',
        details: { path: ['id'], why_exactly: 'required' }
      })
    })
  })


  describe('when the bookmark belongs to another user', () => {
    const seneca = make_seneca()
    const load_bookmark = make_load_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'


    it('responds with "not found"', async () => {
      const { auth_token } = await setup_logged_in_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const another_user = await register_user({
        email: 'alice@example.com',
        pass: '012345678'
      }, { seneca })


      const { id: another_user_id } = another_user
      Assert(another_user_id, 'another_user.id')

      const bookmark_id = await setup_bookmark({
        owner_id: another_user_id,
        name: 'seneca-mem-store'
      }, { seneca })


      const msg = { auth_token, id: bookmark_id }
      const res = await load_bookmark.call(seneca, msg)


      expect(res).toEqual({ ok: false, why: 'not-found' })
    })
  })

  
  describe('when the bookmark belongs to the user', () => {
    const seneca = make_seneca()
    const load_bookmark = make_load_bookmark()


    const user_email = 'bob@example.com'
    const user_pass = 'abcdefghij'
    const pkg_name = 'seneca-mem-store'


    it('returns the bookmark', async () => {
      const { auth_token, user } = await setup_logged_in_user({
        email: user_email,
        pass: user_pass
      }, { seneca })


      const { id: user_id } = user
      Assert(user_id, 'user.id')

      const bookmark_id = await setup_bookmark({
        owner_id: user_id,
        name: pkg_name
      }, { seneca })


      const msg = { auth_token, id: bookmark_id }
      const res = await load_bookmark.call(seneca, msg)


      expect(res).toEqual({
        ok: true,
        data: {
          bookmark: {
            id: bookmark_id,
            owner_id: user_id,
            name: pkg_name
          }
        }
      })
    })
  })
})


async function setup_logged_in_user({ email, pass }, { seneca }) {
  await register_user({ email, pass }, { seneca })

  const {
    login: { token: auth_token },
    user
  } = await login_user({ email, pass }, { seneca })

  Assert(auth_token, 'auth_token')
  Assert(user, 'user')

  return { auth_token, user }
}


async function setup_bookmark(attrs, { seneca }) {
  const bookmark = await seneca.make('nodezoo', 'bookmark')
    .data$(attrs)
    .save$()

  return bookmark.id
}
